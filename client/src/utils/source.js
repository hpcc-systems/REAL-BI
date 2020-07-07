import axios from 'axios';

//.env prop
const { REACT_APP_PROXY_URL } = process.env;

const getSources = async (clusterID, keyword, sourceType) => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/source/search`, {
      params: { clusterID, keyword, sourceType },
    });
  } catch (err) {
    console.error(err);
    return [];
  }

  return response.data;
};

const addSource = async (dashboardID, source) => {
  let response;

  try {
    response = await axios.post(`${REACT_APP_PROXY_URL}/api/source/create`, { dashboardID, source });
  } catch (err) {
    console.error(err);
    return;
  }

  const { id: sourceID, name: sourceName, type: sourceType } = response.data;

  return { sourceID, sourceName, sourceType };
};

const getSourceInfo = async (clusterID, source, sourceType) => {
  let response;

  try {
    response = await axios.get(`${REACT_APP_PROXY_URL}/api/source/info`, {
      params: { clusterID, source, sourceType },
    });
  } catch (err) {
    console.error(err);
    return {};
  }

  return response.data;
};

const createSourceObj = localState => {
  const {
    selectedSource: { target, hpccID, name },
    sourceType,
  } = localState;

  return { hpccID, name, target, type: sourceType };
};

const getUniqueSources = charts => {
  // Get unique source values
  const uniqueSources = Array.from(new Set(charts.map(({ sourceID }) => sourceID))).map(sourceID => {
    return charts.find(({ sourceID: sourceID2 }) => sourceID === sourceID2);
  });

  return uniqueSources;
};

export { addSource, createSourceObj, getSources, getSourceInfo, getUniqueSources };
