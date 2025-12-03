import React from 'react';
import Chart from 'react-apexcharts';
import { jsx as _jsx } from "react/jsx-runtime";
var BarChart = _ref => {
  var {
    data,
    xKey,
    yKey,
    color = '#667eea',
    title,
    height = 300
  } = _ref;
  if (!data || data.length === 0) return null;
  var series = [{
    name: yKey,
    data: data.map(item => item[yKey])
  }];
  var options = {
    chart: {
      type: 'bar',
      height,
      toolbar: {
        show: true
      }
    },
    colors: [color],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: data.map(item => item[xKey]),
      labels: {
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
      y: {
        formatter: val => val.toFixed(1)
      }
    },
    grid: {
      borderColor: '#f0f0f0'
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
      type: "bar",
      height: height
    })
  });
};
export default BarChart;