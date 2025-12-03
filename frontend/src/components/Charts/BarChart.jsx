import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ data, xKey, yKey, color = '#667eea', title, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const series = [{
    name: yKey,
    data: data.map(item => item[yKey])
  }];

  const options = {
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
        formatter: (val) => val.toFixed(1)
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

  return (
    <div className="chart-wrapper">
      <Chart options={options} series={series} type="bar" height={height} />
    </div>
  );
};

export default BarChart;