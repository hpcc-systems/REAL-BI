import React from 'react';
import { Histogram } from '@ant-design/charts';
import _ from 'lodash';
import PropTypes from 'prop-types';

// Utils
import { formatValue } from '../../utils/misc';

// Constants
import { chartFillColor } from '../../constants';

const HistogramChart = ({ configuration, data, pdfPreview }) => {
  const {
    axis1: { label: xLabel, type: xType = 'string', value: xValue } = {},
    groupBy: { type: groupByType = 'string', value: groupByValue } = {},
    binWidth,
    showDataLabels,
  } = configuration;
  const sortOrder = 'asc';
  const customXLabel = xLabel ? xLabel : xValue;

  // Confirm all necessary values are present before trying to render the chart
  if (!data || data.length === 0 || !xValue || !binWidth || isNaN(binWidth)) {
    return null;
  }

  // Convert necessary values to specified data type and sort the array
  data = data.map(row => ({
    ...row,
    [groupByValue]: formatValue(groupByType, row[groupByValue]),
    [`sort${xValue}`]: formatValue(xType, row[xValue], true),
  }));
  data = _.orderBy(data, [`sort${xValue}`], [sortOrder]);

  const chartConfig = {
    appendPadding: [24, 0, 0, 0],
    binField: xValue,
    binWidth,
    data,
    forceFit: true,
    legend: { position: 'right-top' },
    padding: 'auto',
    tooltip: { showContent: !pdfPreview },
    xAxis: {
      min: 0,
      title: { style: { fill: chartFillColor }, text: customXLabel },
    },
  };

  // Add data labels property
  if (showDataLabels) {
    chartConfig.label = {
      formatter: ({ count }) => Intl.NumberFormat('en-US').format(count),
      style: {
        fill: chartFillColor,
        fontSize: 12,
      },
      position: groupByValue ? 'middle' : 'top',
    };
  } else {
    chartConfig.label = null;
  }

  // Add groupby and stacked
  if (groupByValue) {
    chartConfig.stackField = groupByValue;
  } else {
    chartConfig.stackField = null;
  }

  return <Histogram {...chartConfig} />;
};

HistogramChart.defaultProps = {
  configuration: {},
  data: [],
  pdfPreview: false,
};

HistogramChart.propTypes = {
  configuration: PropTypes.shape({
    axis1: PropTypes.shape({
      label: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.string,
    }).isRequired,
    groupBy: PropTypes.shape({
      type: PropTypes.string,
      value: PropTypes.string,
    }),
    showDataLabels: PropTypes.bool,
  }).isRequired,
  data: PropTypes.array,
  pdfPreview: PropTypes.bool,
};

export default HistogramChart;
