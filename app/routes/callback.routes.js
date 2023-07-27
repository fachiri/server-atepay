const controller = require("../controllers/callback.controller");

module.exports = (app) => {
  app.post("/api/callback/accept-payment", controller.acceptPayment)
};
