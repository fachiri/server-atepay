const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash'); 
const session = require("express-session");
const ngrok = require('ngrok');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// app.use(
//   cookieSession({
//     name: "bezkoder-session",
//     keys: [process.env.COOKIE_SECRET],
//     httpOnly: true,
//     sameSite: "strict",
//   }),
// );

app.set('views', './app/views');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(__dirname + "/app/public"));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.alert = req.flash('alert');
  res.locals.message = req.flash('message');
  next();
});

const db = require("./app/models");
const Role = db.role;
const Page = db.page;

db.sequelize.sync({ alter: true });

app.get("/", (req, res) => {
  res.render('../views/page/landing', {layout: 'layout/master3'})
});

const startServer = async () => {
  try {
    const url = await ngrok.connect({
      proto: "http",
      addr: process.env.PORT,
    });
    console.log("Ngrok URL:", url);
    app.listen(process.env.PORT, () => {
      console.log(`Server URL: http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

function initial() {
  try {
    console.log('-----seed')
    Role.findOrCreate({
      where: { id: 1 },
      defaults: { name: "user" },
    });

    Role.findOrCreate({
      where: { id: 2 },
      defaults: { name: "moderator" },
    });

    Role.findOrCreate({
      where: { id: 3 },
      defaults: { name: "admin" },
    });
    Page.findOrCreate({
      where: { id: 1 },
      defaults: { judul: "Halaman Informasi" , url: "/informasi", content: "Halaman Informasi" },
    });
    Page.findOrCreate({
      where: { id: 2 },
      defaults: { judul: "Halaman Tentang" , url: "/tentang", content: "Halaman Tentang" },
    });
    Page.findOrCreate({
      where: { id: 3 },
      defaults: { judul: "Halaman Bantuan" , url: "/bantuan", content: "Halaman Bantuan" },
    });
    Page.findOrCreate({
      where: { id: 4 },
      defaults: { judul: "Halaman Faq" , url: "/faq", content: "Halaman Faq" },
    });
    Page.findOrCreate({
      where: { id: 5 },
      defaults: { judul: "Halaman Hubungi" , url: "/hubungi", content: "Halaman Hubungi" },
    });

    console.log("Roles created or already exist.");
  } catch (error) {
    console.error("Error creating roles:", error);
  }
}

(async () => {
  initial();
  require("./app/routes/auth.routes")(app);
  require("./app/routes/user.routes")(app);
  require("./app/routes/web.routes")(app);
  require("./app/routes/payment.routes")(app);
  require("./app/routes/callback.routes")(app);
  await startServer();
})();
