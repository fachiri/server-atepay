module.exports = (sequelize, Sequelize) => {
  const Slider = sequelize.define("sliders", {
    name: {
      type: Sequelize.STRING,
    },
    order: {
      type: Sequelize.INTEGER(),
    },
  });

  return Slider;
};
