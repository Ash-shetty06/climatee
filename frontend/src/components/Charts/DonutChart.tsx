import React from 'react';
import Chart from 'react-apexcharts';

const DonutChart = ({ data, labels, colors, title, height = 300 }) => {
  if (!data || data.length === 0) return null;

  const options = {
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
      formatter: function (val) {
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

  return (
    <div className="chart-wrapper">
      <Chart options={options} series={data} type="donut" height={height} />
    </div>
  );
};

export default DonutChart;