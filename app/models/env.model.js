module.exports = (sequelize, Sequelize) => {
  const Env = sequelize.define("env", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    value: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  async function getEnv(name) {
    const env = await Env.findOne({ where: { name } });
    return env.value;
  }

  return { Env, getEnv };
};
