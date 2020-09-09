module.exports = (sequelize, DataTypes) => {
  const clusterAuth = sequelize.define(
    'clusterAuth',
    {
      username: DataTypes.STRING,
      hash: DataTypes.STRING,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', tableName: 'clusterAuth', timestamps: false },
  );

  return clusterAuth;
};