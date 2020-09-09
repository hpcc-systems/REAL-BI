const { clusterAuth: clusterAuthModel } = require('../models');

// Utils
const { decryptHash, encryptPassword } = require('./auth');
const { awaitHandler, unNestSequelizeObj } = require('./misc');

const createClusterAuth = async (clusterID, password, userID, username) => {
  let hash = null;

  // Don't save empty string value
  username = username === '' ? null : username;

  if (username && password) {
    hash = encryptPassword(password);
  }

  let [err, newClusterAuth] = await awaitHandler(
    clusterAuthModel.create({ clusterID, hash, userID, username }),
  );

  // Return error
  if (err) throw err;

  // Get nested object
  newClusterAuth = unNestSequelizeObj(newClusterAuth);

  return newClusterAuth;
};

const checkForClusterAuth = async (clusterID, userID) => {
  let [err, clusterAuth] = await awaitHandler(
    clusterAuthModel.findOne({ attributes: ['userID'], where: { clusterID, userID } }),
  );

  // Return error
  if (err) throw err;

  // Get nested object
  clusterAuth = unNestSequelizeObj(clusterAuth);

  return clusterAuth;
};

const getClusterAuth = async (clusterID, userID) => {
  let [err, clusterAuth] = await awaitHandler(
    clusterAuthModel.findOne({ attributes: ['hash', 'username'], where: { clusterID, userID } }),
  );

  // Return error
  if (err) throw err;

  // Get nested object
  const { hash, username } = unNestSequelizeObj(clusterAuth);

  // Check for data
  if (hash && username) {
    clusterAuth = { password: decryptHash(hash), username };
  } else {
    clusterAuth = null;
  }

  return clusterAuth;
};

const updateClusterAuth = async (clusterID, password, userID, username) => {
  let hash = null;

  // Don't save empty string value
  username = username === '' ? null : username;

  if (username && password) {
    hash = encryptPassword(password);
  }

  let [err, clusterAuth] = await awaitHandler(
    clusterAuthModel.update({ hash, username }, { where: { clusterID, userID } }),
  );

  // Return error
  if (err) throw err;

  // Get nested object
  clusterAuth = unNestSequelizeObj(clusterAuth);

  return clusterAuth;
};

module.exports = { checkForClusterAuth, createClusterAuth, getClusterAuth, updateClusterAuth };