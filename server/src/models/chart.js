module.exports = (sequelize, DataTypes) => {
  const chart = sequelize.define(
    'chart',
    {
      query: DataTypes.STRING,
      type: DataTypes.STRING,
      options: DataTypes.JSON,
      sort: DataTypes.INTEGER,
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false,
    },
  );

  chart.associate = ({ dashboard }) => {
    // Create relation from charts to dashboards
    chart.belongsTo(dashboard, {
      foreignKey: { name: 'dashboardID', allowNull: false },
      onDelete: 'cascade',
    });
  };

  return chart;
};
