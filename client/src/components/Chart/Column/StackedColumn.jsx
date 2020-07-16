import React from 'react';
import ReactG2Plot from 'react-g2plot';
import { StackedColumn } from '@antv/g2plot';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

const StackedColumnChart = ({ data, options }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label, description } = options;

  const sortOrder = 'asc';
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

  // Convert necessary values to numbers
  data = data.map(row => ({
    ...row,
    [xAxis]: checkForNumber(row[xAxis]),
    [yAxis]: checkForNumber(row[yAxis]),
  }));

  // Sort data in ascending order
  data = sortArr(data, xAxis, sortOrder);

  const config = {
    data,
    forceFit: true,
    label: {
      formatter: v => thousandsSeparator(v),
      position: 'middle',
      style: { fontSize: 12 },
      visible: true,
    },
    description: {
      visible: true,
      text: description,
    },
    legend: {
      position: 'right-top',
      visible: true,
    },
    meta: {
      [yAxis]: { formatter: v => thousandsSeparator(v) },
    },
    stackField: groupBy,
    xAxis: {
      title: {
        visible: true,
        text: customXLabel,
      },
    },
    xField: xAxis,
    yAxis: {
      title: {
        visible: true,
        text: customYLabel,
      },
    },
    yField: yAxis,
  };

  return <ReactG2Plot Ctor={StackedColumn} config={config} />;
};

export default StackedColumnChart;
