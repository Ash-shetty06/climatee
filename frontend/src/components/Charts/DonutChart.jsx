import React from 'react';
import Chart from 'react-apexcharts';
import { jsx as _jsx } from "react/jsx-runtime";
var DonutChart = _ref => {
  var {
    data,
    labels,
    colors,
    title,
    height = 300
  } = _ref;
  if (!data || data.length === 0) return null;
  var options = {
    chart: {
      type: 'donut',
      height
    },
    labels: labels,
    colors: colors || ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
    legend: {
      position: 'bottom',
      fontSize: '12px'
    },
    dataLabels: {
      enabled: true,
      formatter: function formatter(val) {
        return val.toFixed(1) + '%';
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%'
        }
      }
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
      series: data,
      type: "donut",
      height: height
    })
  });
};
export default DonutChart;