import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';

// Utils
import { getMessage } from '../../../utils/misc';

const useStyles = makeStyles(theme => ({
  formControl: { marginTop: theme.spacing(1) },
  progress: { margin: 0, marginTop: 50 },
}));

const GeneralChartParams = ({ eclRef, localState, updateAxisKey }) => {
  const { schema = [] } = eclRef.current;
  const { chartID, config, selectedDataset = {}, sourceType } = localState;
  const { axis1 = {}, axis2 = {} } = config;
  const { fields = [] } = selectedDataset;
  const { formControl, progress } = useStyles();

  const fieldsArr =
    schema.length > 0 ? schema : fields.length > 0 ? fields : [{ name: getMessage(sourceType), value: '' }];

  return (
    <Grid item md={12}>
      <Grid container spacing={2}>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>X Axis</InputLabel>
            {chartID && fieldsArr.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='axis1:value' value={axis1.value || ''} onChange={updateAxisKey}>
                {fieldsArr.map(({ name, value = name }, index) => {
                  return (
                    <MenuItem key={index} value={value}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Axis Label'
              name='axis1:label'
              value={axis1.label || ''}
              onChange={updateAxisKey}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
        <Grid item md={8}>
          <FormControl className={formControl} fullWidth>
            <InputLabel>Y Axis</InputLabel>
            {chartID && fieldsArr.length <= 1 ? (
              <CircularProgress className={progress} size={20} />
            ) : (
              <Select name='axis2:value' value={axis2.value || ''} onChange={updateAxisKey}>
                {fieldsArr.map(({ name, value = name }, index) => {
                  return (
                    <MenuItem key={index} value={value}>
                      {name}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          </FormControl>
        </Grid>
        <Grid item md={4}>
          <FormControl className={formControl} fullWidth>
            <TextField
              fullWidth
              label='Axis Label'
              name='axis2:label'
              value={axis2.label || ''}
              onChange={updateAxisKey}
              autoComplete='off'
            />
          </FormControl>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default GeneralChartParams;
