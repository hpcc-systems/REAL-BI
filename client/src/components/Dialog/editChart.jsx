import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, Toolbar } from '@material-ui/core';
import { Close as CloseIcon, Refresh as RefreshIcon } from '@material-ui/icons';

// Redux Actions
import { updateChart } from '../../features/chart/actions';

// React Components
import ChartEditor from '../ChartEditor';

// React Hooks
import useForm from '../../hooks/useForm';

// Utils
import { getPreviewData } from '../../utils/chart';

// Create styles
const useStyles = makeStyles(() => ({
  close: { padding: '10px 0', width: 16 },
  div: { flex: 1 },
  toolbar: { padding: 0 },
}));

const EditChartDialog = ({ chartID, show, toggleDialog }) => {
  // Get selected chart
  const { charts } = useSelector(state => state.chart);
  const chartIndex = charts.map(({ id }) => id).indexOf(chartID);

  // Create initial state object
  const { type: chartType, options, ...otherVals } = charts[chartIndex];
  const { groupBy = {}, ...config } = options;
  const initState = {
    chartType,
    config,
    dataObj: { loading: false },
    datasetObj: {},
    groupBy,
    ...otherVals,
  };

  // Set initial state
  const { values: localState, handleChange, handleChangeObj, resetState } = useForm(initState);
  const { clusterID } = useSelector(state => state.dashboard.dashboard);
  const dispatch = useDispatch();
  const { close, div, toolbar } = useStyles();

  // Update chart in DB and store
  const editChart = () => {
    const { chartType: type, config, groupBy, id, params } = localState;
    const chartObj = { id, params, type, options: { ...config, groupBy } };

    updateChart(charts, chartObj).then(action => dispatch(action));

    // Reset and close dialog
    return resetDialog();
  };

  // Reset state and hide dialog
  const resetDialog = () => {
    toggleDialog();
    return resetState(initState);
  };

  const updateChartPreview = () => {
    const { params, query } = localState;

    // Fetch data for query
    getPreviewData({ params, query }, clusterID).then(data => {
      // Set data in local state object with query name as key
      handleChange({ target: { name: 'dataObj', value: { data, loading: false } } });
    });
  };

  return (
    <Dialog open={show} fullWidth maxWidth="xl">
      <Toolbar className={toolbar}>
        <div className={div}>
          <Button className={close} onClick={resetDialog}>
            <CloseIcon />
          </Button>
        </div>
        <Button onClick={updateChartPreview}>
          <RefreshIcon />
        </Button>
      </Toolbar>
      <DialogContent>
        <ChartEditor
          dispatch={dispatch}
          handleChange={handleChange}
          handleChangeObj={handleChangeObj}
          localState={localState}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={resetDialog}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={editChart}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditChartDialog;