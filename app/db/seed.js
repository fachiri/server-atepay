require('dotenv').config();
const db = require("../models");
const Role = db.role;
const Page = db.page;

try {
  console.log('--- Seed Mulai')
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
} catch (error) {
  console.error("Error creating roles:", error);
}