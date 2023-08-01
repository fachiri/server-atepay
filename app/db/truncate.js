require("dotenv").config();
const { exec } = require("child_process");

// FIXME: use Sequelize CLI instead
exec(
  `mysql -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} -e "DROP DATABASE ${process.env.DB_NAME}; CREATE DATABASE ${process.env.DB_NAME};"`,
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  }
);
