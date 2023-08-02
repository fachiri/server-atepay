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
    display: {
      type: Sequelize.INTEGER(0),
      defaultValue: 0,
    },
  });

  return Brand;
};
