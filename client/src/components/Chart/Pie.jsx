import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Utils
import { getRandomColor } from '../../utils/misc';

// Constants
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const staticConfig = { margin: { top: 10, right: 30, left: 10 } };

const PieChartComp = ({ data, options }) => {
  const { xAxis, yAxis } = options;

  return (
    <ResponsiveContainer minWidth={10} minHeight={300}>
      <PieChart {...staticConfig}>
        <Pie
          data={data}
          nameKey={xAxis}
          dataKey={yAxis}
          paddingAngle={3}
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((obj, index) => (
            <Cell key={index} fill={getRandomColor()} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartComp;
