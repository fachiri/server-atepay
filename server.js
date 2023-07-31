const express = require("express");
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.set("views", "./app/views");
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(__dirname + "/app/public"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.alert = req.flash("alert");
  res.locals.message = req.flash("message");
  next();
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/web.routes")(app);
require("./app/routes/payment.routes")(app);
require("./app/routes/callback.routes")(app);
require("./app/routes/product.routes")(app);

app.get("/", (req, res) => {
  res.render("../views/page/landing", { layout: "layout/master3" });
});

const startServer = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(`Server URL: http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

(async () => {
  await startServer();
})();
