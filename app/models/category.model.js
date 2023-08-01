module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define("categories", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });

  return Category;
};
