import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Timeline as LineChartIcon,
  PieChart as PieChartIcon,
} from '@material-ui/icons';

// React Components
import GeneralChartParams from './GeneralChartParams';

const charts = [
  { name: 'Bar', value: 'bar' },
  { name: 'Line', value: 'line' },
  { name: 'Pie', value: 'pie' },
];

const useStyles = makeStyles(() => ({
  formControl: { marginTop: 25 },
  menuIcon: { marginRight: 10 },
}));

const GeneralTab = ({ handleChange, handleChangeObj, localState }) => {
  const {
    chartType,
    options: { horizontal, title },
  } = localState;
  const { formControl, menuIcon } = useStyles();

  const handleCheckbox = useCallback(
    event => {
      const { name, checked } = event.target;

      // Update local state
      handleChangeObj(null, { name, value: checked });
    },
    [handleChangeObj],
  );

  return (
    <Grid container direction='row' alignContent='space-between'>
      <Grid item md={chartType === 'bar' ? 10 : 12}>
        <FormControl className={formControl} fullWidth>
          <InputLabel>Chart Type</InputLabel>
          <Select name='chartType' value={chartType} onChange={handleChange}>
            {charts.map(({ name, value }, index) => {
              return (
                <MenuItem key={index} value={value}>
                  {(() => {
                    switch (value) {
                      case 'bar':
                        return <BarChartIcon className={menuIcon} />;
                      case 'line':
                        return <LineChartIcon className={menuIcon} />;
                      case 'pie':
                        return <PieChartIcon className={menuIcon} />;
                      default:
                        return null;
                    }
                  })()}
                  {name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      {chartType === 'bar' && (
        <Grid item md={2}>
          <FormControlLabel
            className={formControl}
            control={
              <Checkbox
                name='options:horizontal'
                checked={horizontal || false}
                onChange={handleCheckbox}
                color='primary'
              />
            }
            label='Horizontal'
            labelPlacement='top'
          />
        </Grid>
      )}
      <Grid item md={12}>
        <TextField
          fullWidth
          label='Chart Title'
          name='options:title'
          value={title || ''}
          onChange={handleChangeObj}
          autoComplete='off'
        />
      </Grid>
      <Grid item md={12}>
        <GeneralChartParams handleChangeObj={handleChangeObj} localState={localState} />
      </Grid>
    </Grid>
  );
};

export default GeneralTab;
