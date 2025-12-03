import React from 'react';
import Chart from 'react-apexcharts';

const LineChart = ({ data, xKey, yKeys, colors, title, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const series = yKeys.map((key, index) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    data: data.map(item => item[key])
  }));

  const options = {
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

  return (
    <div className="chart-wrapper">
      <Chart options={options} series={series} type="line" height={height} />
    </div>
  );
};

export default LineChart;