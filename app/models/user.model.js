module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    avatar: {
      type: Sequelize.STRING
    },
    code: {
      type: Sequelize.INTEGER(6)
    },
    pin: {
      type: Sequelize.STRING(6)
    },
    status: {
      type: Sequelize.STRING(8),
      defaultValue: 'INACTIVE'
    }
  });

  return User;
};
