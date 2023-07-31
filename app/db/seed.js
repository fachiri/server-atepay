require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../models");
const { ENV } = require("../consts");
const Role = db.role;
const Page = db.page;
const User = db.user;
const Env = db.env;

try {
  console.log("--- Seed Mulai");
  Role.findOrCreate({
    where: { id: 1 },
    defaults: { name: "user" },
  });

  Role.findOrCreate({
    where: { id: 2 },
    defaults: { name: "admin" },
  });

  Page.findOrCreate({
    where: { id: 1 },
    defaults: {
      judul: "Halaman Informasi",
      url: "/informasi",
      content: "Halaman Informasi",
    },
  });

  Page.findOrCreate({
    where: { id: 2 },
    defaults: {
      judul: "Halaman Tentang",
      url: "/tentang",
      content: "Halaman Tentang",
    },
  });

  Page.findOrCreate({
    where: { id: 3 },
    defaults: {
      judul: "Halaman Bantuan",
      url: "/bantuan",
      content: "Halaman Bantuan",
    },
  });

  Page.findOrCreate({
    where: { id: 4 },
    defaults: { judul: "Halaman Faq", url: "/faq", content: "Halaman Faq" },
  });

  Page.findOrCreate({
    where: { id: 5 },
    defaults: {
      judul: "Halaman Hubungi",
      url: "/hubungi",
      content: "Halaman Hubungi",
    },
  });

  User.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: "admin",
      email: "admin@gmail.com",
      password: bcrypt.hashSync("admin", 8),
      phone: "628123456789",
    },
  }).then((user) => {
    user[0].setRoles([2]);
  });

  Env.findOrCreate({
    where: { id: 1 },
    defaults: {
      name: "FLIP_API_URL",
      value: process.env.FLIP_API_URL,
    },
  });

  Env.findOrCreate({
    where: { id: 2 },
    defaults: {
      name: "FLIP_API_SECRET_KEY",
      value: process.env.FLIP_API_SECRET_KEY,
    },
  });

  Env.findOrCreate({
    where: { id: 3 },
    defaults: {
      name: "FLIP_VALIDATION_TOKEN",
      value: process.env.FLIP_VALIDATION_TOKEN,
    },
  });

  Env.findOrCreate({
    where: { id: 4 },
    defaults: {
      name: "TWILIO_ACCOUNT_SID",
      value: process.env.TWILIO_ACCOUNT_SID,
    },
  });

  Env.findOrCreate({
    where: { id: 5 },
    defaults: {
      name: "TWILIO_AUTH_TOKEN",
      value: process.env.TWILIO_AUTH_TOKEN,
    },
  });

  Env.findOrCreate({
    where: { id: 6 },
    defaults: {
      name: "TWILIO_SMS_NUMBER",
      value: process.env.TWILIO_SMS_NUMBER,
    },
  });

  Env.findOrCreate({
    where: { id: 7 },
    defaults: {
      name: "TWILIO_WA_NUMBER",
      value: process.env.TWILIO_WA_NUMBER,
    },
  });

  Env.findOrCreate({
    where: { id: 8 },
    defaults: {
      name: "EMAIL_SERVICE",
      value: process.env.EMAIL_SERVICE,
    },
  });

  Env.findOrCreate({
    where: { id: 9 },
    defaults: {
      name: "EMAIL",
      value: process.env.EMAIL,
    },
  });

  Env.findOrCreate({
    where: { id: 10 },
    defaults: {
      name: "EMAIL_PASSWORD",
      value: process.env.EMAIL_PASSWORD,
    },
  });

  Env.findOrCreate({
    where: { id: 11 },
    defaults: {
      name: "DIGIFLAZZ_USERNAME",
      value: process.env.DIGIFLAZZ_USERNAME,
    },
  });

  Env.findOrCreate({
    where: { id: 12 },
    defaults: {
      name: "DIGIFLAZZ_KEY",
      value:
        process.env.ENVIRONMENT === ENV.DEVELOPMENT
          ? process.env.DIGIFLAZZ_DEVELOPMENT_KEY
          : process.env.DIGIFLAZZ_PRODUCTION_KEY,
    },
  });

  console.log("--- Seed Selesai");
} catch (error) {
  console.error("Error creating roles:", error);
}
