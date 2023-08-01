const controllers = require("../controllers/web.controller");
const multer = require("multer");
const sharp = require("sharp");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

// Konfigurasi penyimpanan file
const store = (destination) =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destination);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  });

const upload = multer({
  storage: store("app/public/uploads/sliders/"),
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      req.flash("alert", "danger");
      req.flash("message", "Only image files are allowed.");
      return cb(null, false);
    }
  },
});

const uploadIcon = multer({
  storage: store("app/public/uploads/icons/"),
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith("image")) {
      req.flash("alert", "danger");
      req.flash("message", "Only image files are allowed.");
      return cb(null, false);
    }

    cb(null, true);
  },
});

const resize = async (req, res, next) => {
  if (!req.file) return next();

  const buffer = await sharp(req.file.path).resize(30, 30).toBuffer();

  sharp(buffer).toFile(req.file.path, (err) => {
    if (err) {
      console.log(err);
      req.flash("alert", "danger");
      req.flash("message", "Failed to upload icon.");
      return res.redirect("/categories");
    }

    next();
  });
};

const uploadIconWithSize = [uploadIcon.single("icon"), resize];

const bindUserSession = (req, res, next) => {
  res.locals.user = req.session.user;
  next();
};

const checkUserSession = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash("alert", "danger");
    req.flash("message", "You must login first.");
    res.redirect("/login");
  }
};

const authenticate = [checkUserSession, bindUserSession];

module.exports = async (app) => {
  app.use(methodOverride("_method"));

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/", (req, res) => {
    res.render("../views/page/landing", {
      layout: "layout/master3",
      title: "Atepay",
      url: "/",
    });
  });

  app.get("/dashboard", authenticate, (req, res) => {
    res.render("../views/page/index", {
      title: "Dashboard",
      layout: "layout/master",
      url: "/dashboard",
    });
  });

  // setting
  app.get("/setting", authenticate, controllers.setting);
  app.post(
    "/setting/slider/add",
    upload.single("slider"),
    controllers.sliderAdd
  );
  app.get("/setting/slider/delete/:id", authenticate, controllers.sliderDelete);
  app.post(
    "/setting/slider/moveLeft/:id",
    authenticate,
    controllers.sliderMoveLeft
  );
  app.post(
    "/setting/slider/moveRight/:id",
    authenticate,
    controllers.sliderMoveRight
  );
  app.post(
    "/setting/pages/updateContent/:id",
    authenticate,
    controllers.updateContent
  );
  app.post("/setting/env/update", authenticate, controllers.updateEnv);

  app.get("/products", authenticate, controllers.products);
  app.get("/products/:id", authenticate, controllers.productsDetail);
  app.put("/products", authenticate, controllers.productsUpdate);

  // categories
  app.get("/categories", authenticate, controllers.categories);
  app.post(
    "/categories",
    authenticate,
    uploadIconWithSize,
    controllers.categoriesAdd
  );
  app.get("/categories/:id/edit", authenticate, controllers.categoriesEdit);
  app.put(
    "/categories/:id",
    authenticate,
    uploadIconWithSize,
    controllers.categoriesUpdate
  );
  app.delete("/categories/:id", authenticate, controllers.categoriesDelete);
  app.get(
    "/categories/:id/products",
    authenticate,
    controllers.categoriesProducts
  );

  app.get("/users", authenticate, controllers.users.index);
  app.get("/users/:id", authenticate, controllers.users.show);

  app.get("/login", (req, res) => {
    if (req.session.user) return res.redirect("/dashboard");

    res.render("../views/page/login", {
      title: "login",
      layout: "layout/master2",
    });
  });
  app.post("/login", controllers.login);
  app.get("/logout", controllers.logout);

  // redirect_url
  app.get("/redirect", (req, res) => {
    res.redirect("atepay://");
  });

  app.get("/:url", controllers.page);
};
