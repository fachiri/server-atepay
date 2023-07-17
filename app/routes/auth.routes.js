const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);

  app.post("/api/auth/checktoken", controller.checktoken);

  app.post("/api/auth/verifytoken", controller.verifytoken);
  
  app.post("/api/auth/createpin", controller.createpin);
  
  app.post("/api/auth/resetpin", controller.resetpin);

  app.post("/api/auth/resetpassword", controller.resetpassword);

  app.post("/api/auth/sendotp", controller.sendotp)

};
