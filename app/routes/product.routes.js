const controller = require("../controllers/product.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.get("/api/products", [authJwt.verifyToken], controller.index);
  app.post(
    "/api/products",
    [authJwt.verifyToken],
    controller.getByCategoryAndBrand
  );
};
