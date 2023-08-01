const controller = require("../controllers/product.controller");

module.exports = (app) => {
  app.get("/api/products", controller.index);
};
