module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("notifications", {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    isRead: {
      type: Sequelize.INTEGER(1),
      defaultValue: 0
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    data: {
      type: Sequelize.TEXT,
    }
  });

  return Notification;
};
