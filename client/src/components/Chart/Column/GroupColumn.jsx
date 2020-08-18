import React from 'react';
import { GroupedColumn } from '@ant-design/charts';

// Utils
import { checkForNumber, thousandsSeparator, sortArr } from '../../../utils/misc';

const GroupColumnComp = ({ data, config }) => {
  const { groupBy, xAxis, yAxis, xAxis_Label, yAxis_Label } = config;

  const sortOrder = 'asc';
  const customXLabel = typeof xAxis_Label !== 'undefined' ? xAxis_Label : xAxis;
  const customYLabel = typeof yAxis_Label !== 'undefined' ? yAxis_Label : yAxis;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !groupBy || !xAxis || !yAxis) {
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
    groupField: groupBy,
    xAxis: {
      title: {
        visible: true,
        text: customXLabel,
        fill: '#333',
      },
    },
    xField: xAxis,
    yAxis: {
      title: {
        visible: true,
        text: customYLabel,
        fill: '#333',
      },
    },
    yField: yAxis,
  };

  return <GroupedColumn {...chartConfig} />;
};

export default GroupColumnComp;
