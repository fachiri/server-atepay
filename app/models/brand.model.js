module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define("brands", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    icon: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "icon-default.png",
    },
  });

  return Brand;
};
