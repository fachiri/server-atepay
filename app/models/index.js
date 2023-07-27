const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: +process.env.DB_POOL_MAX,
      min: +process.env.DB_POOL_MIN,
      acquire: +process.env.DB_POOL_ACQUIRE,
      idle: +process.env.DB_POOL_IDLE
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.slider = require("../models/slider.model.js")(sequelize, Sequelize);
db.bill = require("../models/bill.model.js")(sequelize, Sequelize);
db.payment = require("../models/payment.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});
db.bill.belongsTo(db.payment, {
  foreignKey: 'link_id', // Name of the foreign key field in the bill table
  targetKey: 'bill_link_id', // Name of the target key field in the payment table
});

db.payment.hasMany(db.bill, {
  foreignKey: 'link_id', // Name of the foreign key field in the bill table
  sourceKey: 'bill_link_id', // Name of the source key field in the payment table
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
