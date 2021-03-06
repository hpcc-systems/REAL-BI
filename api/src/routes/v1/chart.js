const router = require('express').Router();
const {
  createChart,
  deleteChartByID,
  updateChartByID,
  getChartsByDashboardID,
  getChartByID,
} = require('../../utils/chart');
const { getClusterByID } = require('../../utils/cluster');
const { getFileDataFromCluster } = require('../../utils/hpccFiles');
const { getQueryDataFromCluster } = require('../../utils/hpccQueries');
const { getSourceByID, updateSourceByID } = require('../../utils/source');
const { getDashboardByID } = require('../../utils/dashboard');
const { getDashboardFiltersWithValues } = require('../../utils/dashboardFilter');
const { getWorkunitDataFromCluster, getWorkunitDataFromClusterWithParams } = require('../../utils/hpccEcl');
const { getDashboardRelationsByChartID } = require('../../utils/dashboardRelation');

router.post('/', async (req, res, next) => {
  const {
    body: { chart, dashboardID, sourceID },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    const charts = await getChartsByDashboardID(dashboardID);
    const { id } = await createChart(chart, dashboardID, sourceID, charts.length);
    const newChart = await getChartByID(id);

    return res.status(201).json(newChart);
  } catch (error) {
    next(error);
  }
});

router.get('/data', async (req, res, next) => {
  const {
    query: { chartID, clusterID, dashboardID, interactiveObj = {} },
    user: { id: userID },
  } = req;
  const parsedObj = JSON.parse(interactiveObj);

  try {
    const cluster = await getClusterByID(clusterID);
    const { configuration, source } = await getChartByID(chartID);
    const dashboardFilters = await getDashboardFiltersWithValues(chartID, dashboardID, userID);

    let data;

    // Static textboxes won't have a source object
    if (!source) {
      return res.status(200).end();
    }

    // Default params to chart params or empty array
    const dataParams = configuration.params || [];

    // Get dashboard filters
    dashboardFilters.forEach(filter => {
      const { configuration, value } = filter;

      configuration.params.forEach(({ targetChart, targetParam, startTargetParam, endTargetParam }) => {
        if (chartID === targetChart) {
          let dataParamIndex = dataParams.findIndex(({ name }) => name === targetParam);

          if (configuration.type === 'dateRange') {
            const valuesArr = value.split(',');

            valuesArr.forEach((value, index) => {
              const paramField = index === 0 ? startTargetParam : endTargetParam;
              let dataParamIndex = dataParams.findIndex(({ name }) => name === paramField);

              if (dataParamIndex > -1) {
                dataParams[dataParamIndex] = { name: paramField, value };
              } else {
                dataParams.push({ name: paramField, value });
              }
            });
          } else {
            let filterVal = value;

            if (configuration.type === 'dateField' && filterVal.indexOf(',') > -1) {
              filterVal = filterVal.split(',')[0];
            }

            if (dataParamIndex > -1) {
              dataParams[dataParamIndex] = { name: targetParam, value: filterVal };
            } else {
              dataParams.push({ name: targetParam, value: filterVal });
            }
          }
        }
      });
    });

    // Interactive click filters
    if (parsedObj?.chartID) {
      const dashboardRelations = await getDashboardRelationsByChartID(dashboardID, parsedObj, chartID);

      dashboardRelations.forEach(({ targetField }) => {
        const dataParamIndex = dataParams.findIndex(({ name }) => name === targetField);

        if (dataParamIndex > -1) {
          dataParams[dataParamIndex] = { name: targetField, value: parsedObj.value };
        } else {
          dataParams.push({ name: targetField, value: parsedObj.value });
        }
      });
    }

    const options = { params: dataParams, source };

    switch (source.type) {
      case 'file':
        data = await getFileDataFromCluster(cluster, options, userID);
        break;
      case 'ecl':
        if (dataParams.filter(({ name }) => name !== 'Count').length > 0) {
          data = await getWorkunitDataFromClusterWithParams(
            cluster,
            configuration,
            dataParams,
            source,
            userID,
          );
        } else {
          data = await getWorkunitDataFromCluster(cluster, configuration, source, userID);
        }
        break;
      default:
        data = await getQueryDataFromCluster(cluster, { ...options, dataset: configuration.dataset }, userID);
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  const {
    body: { chart, dashboardID },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    if (!chart.configuration.isStatic) {
      const source = await getSourceByID(chart.source.id);

      if (source.name === 'ecl') {
        const { workunitID } = chart.configuration.ecl;
        await updateSourceByID(chart.source.id, { hpccID: workunitID, name: workunitID });
      }
    }

    await updateChartByID(chart, chart?.source?.id);
    const { charts } = await getDashboardByID(dashboardID, userID);

    return res.status(200).json(charts);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const {
    query: { chartID, dashboardID },
    user: { id: userID },
  } = req;

  try {
    const { permission = 'Read-Only' } = await getDashboardByID(dashboardID, userID);

    if (permission !== 'Owner') {
      const error = new Error('Permission Denied');
      throw error;
    }

    await deleteChartByID(chartID);
    const { charts } = await getDashboardByID(dashboardID, userID);

    return res.status(200).json(charts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
