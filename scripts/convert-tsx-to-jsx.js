#!/usr/bin/env node

/**
 * Convert TypeScript React files (.tsx/.ts) to JavaScript React files (.jsx/.js)
 * Uses Babel to strip TypeScript syntax while preserving JSX and JavaScript code
 * 
 * Usage:
 *   node scripts/convert-tsx-to-jsx.js 'src/**\/*.{ts,tsx}'
 *   node scripts/convert-tsx-to-jsx.js 'src/**\/*.{ts,tsx}' --replace
 */

const fs = require('fs');
const path = require('path');
const { transformFileSync } = require('@babel/core');
const { glob } = require('glob');

const args = process.argv.slice(2);
const pattern = args[0];
const replaceOriginal = args.includes('--replace');

if (!pattern) {
  console.error('❌ Error: Please provide a glob pattern');
  console.error('Usage: node scripts/convert-tsx-to-jsx.js \'src/**/*.{ts,tsx}\' [--replace]');
  process.exit(1);
}

console.log('🚀 Starting TypeScript to JavaScript conversion...\n');
console.log(`📁 Pattern: ${pattern}`);
console.log(`🔄 Replace original: ${replaceOriginal}\n`);

// Find all TypeScript files
const files = glob.sync(pattern, {
  ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts'],
  cwd: process.cwd()
});

if (files.length === 0) {
  console.log('⚠️  No TypeScript files found matching pattern:', pattern);
  process.exit(0);
}

console.log(`📝 Found ${files.length} TypeScript file(s) to convert\n`);

let successCount = 0;
let errorCount = 0;
const errors = [];

files.forEach((file) => {
  try {
    const absolutePath = path.resolve(file);
    const ext = path.extname(file);
    const newExt = ext === '.tsx' ? '.jsx' : '.js';
    const outputPath = absolutePath.replace(new RegExp(`\\${ext}$`), newExt);

    // Transform the file using Babel
    const result = transformFileSync(absolutePath, {
      presets: [
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
      filename: absolutePath,
      retainLines: true,
      configFile: false,
      babelrc: false,
    });

    if (!result || !result.code) {
      throw new Error('Babel transformation returned no code');
    }

    // Write the converted file
    fs.writeFileSync(outputPath, result.code, 'utf8');
    console.log(`✅ ${file} → ${path.relative(process.cwd(), outputPath)}`);

    // Remove original if --replace flag is set
    if (replaceOriginal && absolutePath !== outputPath) {
      fs.unlinkSync(absolutePath);
      console.log(`   🗑️  Removed original: ${file}`);
    }

    successCount++;
  } catch (error) {
    console.error(`❌ Error converting ${file}:`, error.message);
    errors.push({ file, error: error.message });
    errorCount++;
  }
});

console.log('\n' + '='.repeat(50));
console.log('📊 Conversion Summary:');
console.log(`   ✅ Success: ${successCount}`);
console.log(`   ❌ Errors: ${errorCount}`);
console.log('='.repeat(50));

if (errors.length > 0) {
  console.log('\n❌ Errors encountered:');
  errors.forEach(({ file, error }) => {
    console.log(`   - ${file}: ${error}`);
  });
  process.exit(1);
}

console.log('\n✨ Conversion complete!\n');

if (replaceOriginal) {
  console.log('⚠️  Next steps:');
  console.log('   1. Review the converted files');
  console.log('   2. Update import statements if they have explicit .tsx/.ts extensions');
  console.log('   3. Test your application');
  console.log('   4. Update package.json to remove TypeScript dependencies');
  console.log('   5. Remove tsconfig.json\n');
}
