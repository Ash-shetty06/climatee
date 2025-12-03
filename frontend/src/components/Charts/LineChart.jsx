import React from 'react';
import Chart from 'react-apexcharts';
import { jsx as _jsx } from "react/jsx-runtime";
var LineChart = _ref => {
  var {
    data,
    xKey,
    yKeys,
    colors,
    title,
    height = 300
  } = _ref;
  if (!data || data.length === 0) return null;
  var series = yKeys.map((key, index) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    data: data.map(item => item[key])
  }));
  var options = {
    chart: {
      type: 'line',
      height,
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          pan: true
        }
      },
      animations: {
        enabled: true,
        speed: 800
      }
    },
    colors: colors || ['#667eea', '#764ba2'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: data.map(item => item[xKey]),
      labels: {
        rotate: -45,
        style: {
          fontSize: '11px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px'
        }
      }
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false
    },
    legend: {
      show: true,
      position: 'top'
    },
    grid: {
      borderColor: '#f0f0f0',
      strokeDashArray: 4
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#333'
      }
    }
  };
  return /*#__PURE__*/_jsx("div", {
    className: "chart-wrapper",
    children: /*#__PURE__*/_jsx(Chart, {
      options: options,
      series: series,
      type: "line",
      height: height
    })
  });
};
export default LineChart;