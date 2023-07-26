module.exports = (sequelize, Sequelize) => {
    const Page = sequelize.define("pages", {
      judul: {
        type: Sequelize.STRING,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
    });
  
    return Page;
  };
  