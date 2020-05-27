import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Grid, Tab, Tabs } from '@material-ui/core';

// React Components
import QuerySearch from './QuerySearch';
import SelectDataset from './SelectDataset';
import { General, GroupBy, Parameters } from './Tabs';
import Chart from '../Chart';

// Constants
import { hasGroupByOption } from '../../utils/misc';

const tabOptions = [
  { name: 'General', disabled: false },
  { name: 'Parameters', disabled: false },
  { name: 'Group By', disabled: false },
];

// Create styles
const useStyles = makeStyles(theme => ({
  appbar: { marginBottom: theme.spacing(1) },
  gridContainer: { overflowY: 'hidden' },
}));

const ChartEditor = props => {
  const { chartType, dataObj, dataset, options } = props.localState;
  const [tabIndex, setTabIndex] = useState(0);
  const { appbar, gridContainer } = useStyles();

  const changeTabIndex = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Create object of information to pass to chart components
  const chart = { dataset, options, type: chartType };

  return (
    <Grid container spacing={4} className={gridContainer}>
      <Grid item xs={6}>
        <QuerySearch {...props} />
        <SelectDataset {...props} />
        <AppBar className={appbar} position='static' color='inherit'>
          <Tabs value={tabIndex} onChange={changeTabIndex}>
            {tabOptions.map(({ name, disabled }, index) => {
              /*
                Do not show the 'group by' tab if the chart selected doesn't support group by
                Do not show any table other than General if the table chart type is selected
              */
              if (
                (!hasGroupByOption(chartType) && name === 'Group By') ||
                (chartType === 'table' && name !== 'General')
              ) {
                return null;
              }

              return <Tab key={index} label={name} disabled={disabled} />;
            })}
          </Tabs>
        </AppBar>
        {(() => {
          switch (tabIndex) {
            case 0:
              return <General {...props} />;
            case 1:
              return <Parameters {...props} />;
            case 2:
              return <GroupBy {...props} />;
            default:
              return 'Unknown Tab';
          }
        })()}
      </Grid>
      <Grid item xs={6}>
        <Chart chart={chart} dataObj={dataObj} />
      </Grid>
    </Grid>
  );
};

export default ChartEditor;
