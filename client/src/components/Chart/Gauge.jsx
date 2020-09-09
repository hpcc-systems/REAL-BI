import React from 'react';
import { Gauge } from '@ant-design/charts';

// Utils
import { checkForNumber } from '../../utils/misc';

// Constants
import { chartFillColor } from '../../constants';

const GaugeComp = ({ data, config }) => {
  const {
    axis1: { value = null },
    axis2: { value: val2 = null },
    axis3: { value: val3 = null },
  } = config;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !value || !val2 || !val3) {
    return null;
  }

  const minVal = Number(val2);
  const maxVal = Number(val3);

  // Create range array of equal segments
  const split = (min, max, segments) => {
    const result = [];
    let delta = (max - min) / (segments - 1);

    // Add smaller numbers to array and increase by delta
    while (min < max) {
      result.push(min);
      min += delta;
    }

    // Add max value to end of array
    result.push(max);

    return result;
  };

  // Convert necessary values to numbers
  data = data.map(row => ({ ...row, [value]: checkForNumber(row[value]) }));

  const chartConfig = {
    color: ['#39B8FF', '#52619B', '#43E089', '#C0EDF3'],
    data,
    forceFit: true,
    min: minVal,
    max: maxVal,
    range: split(minVal, maxVal, 5),
    statistic: {
      color: chartFillColor,
      position: ['50%', '90%'],
      text: data[0][value],
      visible: true,
    },
    value: data[0][value],
  };

  return <Gauge {...chartConfig} />;
};

export default GaugeComp;