const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const ngrok = require("ngrok");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"],
    httpOnly: true,
    sameSite: "strict",
  })
);

const db = require("./app/models");
const Role = db.role;

db.sequelize.sync();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

const startServer = async () => {
  try {
    const url = await ngrok.connect({
      proto: "http",
      addr: 8080, // Ganti dengan nomor port server Anda
    });
    console.log("Ngrok URL:", url);
  } catch (error) {
    console.error("Error starting ngrok:", error);
  }

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
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
