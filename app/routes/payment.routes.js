const controller = require("../controllers/payment.controller");

module.exports = (app) => {
  app.post("/api/payment/create-bill", controller.createBill)
};
