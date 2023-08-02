const controller = require("../controllers/payment.controller");
const { authJwt } = require("../middleware");

module.exports = (app) => {
  app.post("/api/payment/create-bill", [authJwt.verifyToken], controller.createBill)
  app.get("/api/payment/my-bills", [authJwt.verifyToken], controller.myBills)
  app.get("/api/payment/my-bill", [authJwt.verifyToken], controller.myBill)
  app.get("/api/payment/my-balance", [authJwt.verifyToken], controller.myBalance)
  app.post("/api/payment/buyer/topup", [authJwt.verifyToken], controller.topup)
};
