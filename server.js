const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash'); 
const session = require("express-session");
require('dotenv').config();

const app = express();

const useNgrok = process.env.USE_NGROK === "true";
const port = useNgrok ? 
4000 : process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  secret: 'atepay-secret-key',
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

db.sequelize.sync();
// db.sequelize.sync({ alter: true});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Atepay." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/web.routes")(app);
require("./app/routes/payment.routes")(app);

const startServer = async () => {
  try {
    if (useNgrok) {
      const url = await ngrok.connect({
        proto: "http",
        addr: port,
      });
      console.log("Ngrok URL:", url);
    }

    app.listen(port, () => {
      console.log(`Server URL: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

function initial() {
  try {
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

    console.log("Roles created or already exist.");
  } catch (error) {
    console.error("Error creating roles:", error);
  }
}

(async () => {
  await startServer();
  initial();
})();
