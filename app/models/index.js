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
      idle: +process.env.DB_POOL_IDLE,
    },
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const ENV = require("./env.model.js")(sequelize, Sequelize);
db.env = ENV.Env;
db.getEnv = ENV.getEnv;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.slider = require("../models/slider.model.js")(sequelize, Sequelize);
db.page = require("../models/page.model.js")(sequelize, Sequelize);
db.bill = require("../models/bill.model.js")(sequelize, Sequelize);
db.payment = require("../models/payment.model.js")(sequelize, Sequelize);
db.notification = require("../models/notification.model.js")(sequelize, Sequelize);
db.category = require("../models/category.model.js")(sequelize, Sequelize);
db.product = require("../models/product.model.js")(sequelize, Sequelize);
db.brand = require("../models/brand.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles",
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
});

db.bill.belongsTo(db.payment);
db.payment.hasOne(db.bill);
db.user.hasMany(db.notification);
db.notification.belongsTo(db.user);

db.category.hasMany(db.brand, { as: 'categoryBrands' });
db.brand.belongsTo(db.category, { as: 'brandCategory' });

db.brand.hasMany(db.product, { as: 'brandProducts' });
db.product.belongsTo(db.brand, { as: 'productBrand' });

db.ROLES = ["user", "admin"];

module.exports = db;
