#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { transformSync } = require('@babel/core');
const glob = require('glob');

/**
 * Script to convert TypeScript React files (.tsx/.ts) to JavaScript (.jsx/.js)
 * Uses Babel to strip TypeScript syntax and preserve JSX
 * 
 * Usage:
 *   node scripts/convert-tsx-to-jsx.js 'src/**\/*.{ts,tsx}'           # Preview conversion
 *   node scripts/convert-tsx-to-jsx.js 'src/**\/*.{ts,tsx}' --replace # Replace original files
 */

// Parse command line arguments
const args = process.argv.slice(2);
const pattern = args[0] || 'src/**/*.{ts,tsx}';
const shouldReplace = args.includes('--replace');

console.log('🔄 TypeScript to JavaScript Converter\n');
console.log(`Pattern: ${pattern}`);
console.log(`Mode: ${shouldReplace ? 'REPLACE' : 'PREVIEW'}\n`);

// Babel configuration for TypeScript removal
const babelConfig = {
  presets: [
    ['@babel/preset-env', {
      modules: false, // Preserve ES modules
      targets: {
        esmodules: true
      }
    }],
    ['@babel/preset-typescript', { 
      isTSX: true, 
      allExtensions: true,
      onlyRemoveTypeImports: true
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }]
  ],
  filename: 'file.tsx', // Required for preset-typescript
};

// Find all TypeScript files
const files = glob.sync(pattern, {
  cwd: process.cwd(),
  absolute: false,
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

if (files.length === 0) {
  console.log('❌ No files found matching pattern:', pattern);
  process.exit(1);
}

console.log(`Found ${files.length} file(s) to convert\n`);

let successCount = 0;
let errorCount = 0;

// Process each file
files.forEach((filePath) => {
  try {
    const absolutePath = path.resolve(filePath);
    const sourceCode = fs.readFileSync(absolutePath, 'utf-8');
    
    // Determine output extension
    const isTsx = filePath.endsWith('.tsx');
    const isTs = filePath.endsWith('.ts');
    let outputPath;
    
    if (isTsx) {
      outputPath = filePath.replace(/\.tsx$/, '.jsx');
    } else if (isTs) {
      outputPath = filePath.replace(/\.ts$/, '.js');
    } else {
      console.log(`⚠️  Skipping: ${filePath} (not a .ts or .tsx file)`);
      return;
    }
    
    // Transform the code
    const result = transformSync(sourceCode, {
      ...babelConfig,
      filename: filePath
    });
    
    if (!result || !result.code) {
      throw new Error('Babel transformation returned empty result');
    }
    
    if (shouldReplace) {
      // Write the converted file
      fs.writeFileSync(outputPath, result.code, 'utf-8');
      
      // Delete the original TypeScript file
      if (outputPath !== filePath) {
        fs.unlinkSync(absolutePath);
        console.log(`✅ ${filePath} -> ${outputPath}`);
      }
    } else {
      console.log(`📄 Would convert: ${filePath} -> ${outputPath}`);
    }
    
    successCount++;
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`✨ Conversion ${shouldReplace ? 'complete' : 'preview complete'}`);
console.log(`   Success: ${successCount}`);
console.log(`   Errors: ${errorCount}`);

if (!shouldReplace && successCount > 0) {
  console.log(`\n💡 Run with --replace to actually convert files:`);
  console.log(`   npm run convert:tsx:replace`);
}

console.log('');
