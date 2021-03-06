const { workspace_directory: WorkspaceDirectory } = require('../models');
const { unNestSequelizeObj } = require('./sequelize');

const getWorkspaceDirectory = async (workspaceID, userID) => {
  let directory = await WorkspaceDirectory.findOne({
    attributes: ['directory'],
    where: { workspaceID, userID },
  });
  directory = unNestSequelizeObj(directory);

  return directory;
};

const updateWorkspaceDirectory = async (directory, workspaceID, userID) => {
  return await WorkspaceDirectory.update({ directory }, { where: { workspaceID, userID } });
};

const createWorkspaceDirectory = async (directory, workspaceID, userID) => {
  return await WorkspaceDirectory.create({ directory, workspaceID, userID });
};

module.exports = { createWorkspaceDirectory, getWorkspaceDirectory, updateWorkspaceDirectory };
