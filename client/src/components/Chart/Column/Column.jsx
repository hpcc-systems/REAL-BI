import React from 'react';
import { Column } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

const ColumnComp = ({ data, config }) => {
  const { xAxis, yAxis, xAxis_Label, yAxis_Label } = config;

  const sortOrder = 'asc';
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xAxis || !yAxis) {
    return null;
  }

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xAxis]: checkForNumber(row[xAxis]),
    [yAxis]: checkForNumber(row[yAxis]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xAxis, sortOrder);

  const chartConfig = {
    data,
    forceFit: true,
    label: { visible: false },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [yAxis]: { formatter: v => thousandsSeparator(v) },
    },
    xAxis: {
      min: 0,
      title: {
        visible: true,
        text: customXLabel,
        fill: '#333',
      },
    },
    xField: xAxis,
    yAxis: {
      min: 0,
      title: {
        visible: true,
        text: customYLabel,
        fill: '#333',
      },
    },
    yField: yAxis,
  };

  return <Column {...chartConfig} />;
};

export default ColumnComp;
