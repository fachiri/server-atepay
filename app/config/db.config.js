module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "130508@Momunu",
  DB: "atepay",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
