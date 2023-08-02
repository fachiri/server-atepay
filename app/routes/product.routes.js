const controller = require("../controllers/product.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.get("/api/products", [authJwt.verifyToken], controller.index);
  app.get("/api/brand/:id", [authJwt.verifyToken], controller.brand);
  app.post("/api/brands", [authJwt.verifyToken], controller.brands);
};
