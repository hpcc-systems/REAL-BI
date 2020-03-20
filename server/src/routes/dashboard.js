const router = require('express').Router();

// Utils
const { createDashboard, getDashboardByID, getDashboardsByUserID } = require('../utils/dashboard');
const { findAllQueryParams } = require('../utils/queryParam');

router.get('/all', async (req, res) => {
  let dashboards;

  try {
    dashboards = await getDashboardsByUserID(req.user.id);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json(dashboards);
});

router.post('/create', async (req, res) => {
  const {
    body: { clusterID, name },
    user: { id: userID },
  } = req;
  let dashboards;

  try {
    await createDashboard(clusterID, name, userID);
    dashboards = await getDashboardsByUserID(userID);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(201).json(dashboards);
});

router.get('/info', async (req, res) => {
  const { dashboardID } = req.query;
  let dashboard, params;

  try {
    dashboard = await getDashboardByID(dashboardID);
    params = await findAllQueryParams(dashboardID, null);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Error' });
  }

  return res.status(200).json({ ...dashboard, params });
});

module.exports = router;
