const bcrypt = require("bcryptjs");
const md5 = require("md5");
const db = require("../models");
const axios = require("axios");
const User = db.user;
const Slider = db.slider;
const Page = db.page;
const Env = db.env;
const getEnv = db.getEnv;
const Category = db.category;

exports.setting = async (req, res) => {
  const page = "../views/page/setting";
  const title = "Pengaturan";
  const layout = "layout/master";
  const envs = [];
  let sliders;
  let pages;
  try {
    sliders = await Slider.findAll({
      order: [["order", "ASC"]],
    });
    pages = await Page.findAll({
      id: [["id", "ASC"]],
    });

    const env = await Env.findAll();
    env.forEach((item) => {
      envs.push({ name: item.name, value: item.value });
    });
  } catch (error) {
    req.flash("alert", "danger");
    req.flash("message", error.message);
  }
  res.render(page, { title, layout, sliders, pages, envs });
};

exports.sliderAdd = async (req, res) => {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      throw new Error("Please choose an image file.");
    }

    const maxOrderSlider = await Slider.max("order");
    const newOrder = maxOrderSlider !== null ? maxOrderSlider + 1 : 0;
    await Slider.create({
      name: uploadedFile.filename,
      order: newOrder,
    });

    req.flash("alert", "success");
    req.flash("message", "Data berhasil disimpan.");
  } catch (error) {
    req.flash("alert", "danger");
    req.flash("message", error.message);
  }
  return res.redirect("/setting");
};

exports.sliderDelete = async (req, res) => {
  try {
    const slideId = req.params.id;

    await Slider.destroy({
      where: {
        id: slideId,
      },
    });

    req.flash("alert", "success");
    req.flash("message", "Data berhasil dihapus.");
  } catch (error) {
    req.flash("alert", "danger");
    req.flash("message", error.message);
  }
  return res.redirect("/setting");
};
exports.sliderMoveRight = async (req, res) => {
  try {
    const slideId = req.params.id;

    const slider = await Slider.findByPk(slideId);

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    // Cek apakah slider sudah berada di posisi paling kanan
    const maxOrderSlider = await Slider.findOne({
      order: [["order", "DESC"]],
    });

    if (slider.order === maxOrderSlider.order) {
      return res
        .status(400)
        .json({ message: "Slider is already at the right most position" });
    }

    const nextSlider = await Slider.findOne({
      where: { order: slider.order + 1 },
    });

    slider.order += 1;
    nextSlider.order -= 1;

    await Promise.all([slider.save(), nextSlider.save()]);

    req.flash("alert", "success");
    req.flash("message", "Data berhasil dipindah.");
  } catch (error) {
    req.flash("alert", "danger");
    req.flash("message", error.message);
  }
  return res.redirect("/setting");
};
exports.sliderMoveLeft = async (req, res) => {
  try {
    const slideId = req.params.id;

    const slider = await Slider.findByPk(slideId);

    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    if (slider.order === 0) {
      return res
        .status(400)
        .json({ message: "Slider is already at the left most position" });
    }

    const previousSlider = await Slider.findOne({
      where: { order: slider.order - 1 },
    });

    slider.order -= 1;
    previousSlider.order += 1;

    await Promise.all([slider.save(), previousSlider.save()]);

    req.flash("alert", "success");
    req.flash("message", "Data berhasil dipindah.");
  } catch (error) {
    req.flash("alert", "danger");
    req.flash("message", error.message);
  }
  return res.redirect("/setting");
};

exports.updateContent = async (req, res) => {
  try {
    const id = req.params.id;
    const newJudul = req.body.judul;
    const newContent = req.body.content;

    const page = await Page.findByPk(id);

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    await page.update({ judul: newJudul, content: newContent });

    req.flash("alert", "success");
    req.flash("message", "Data berhasil diubah.");
  } catch (error) {
    req.flash("alert", "danger");
    req.flash("message", "Gagal mengubah data,");
  }
  return res.redirect("/setting");
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      throw new Error("Email atau Password salah!");
    }

    const isPasswordMatch = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      throw new Error("Email atau Password salah!");
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    req.flash("alert", "success");
    req.flash("message", "Login berhasil.");

    return res.redirect("/dashboard");
  } catch (error) {
    req.flash("alert", "danger");
    req.flash("message", error.message);

    return res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/login");
};

exports.page = async (req, res) => {
  const page = await Page.findOne({
    where: {
      url: `/${req.params.url}`,
    },
  });

  if (!page) return res.render("../views/page/404", { layout: false });

  const title = page.judul;
  const url = page.url;
  const layout = "layout/master3";
  const pages = await Page.findAll();

  res.render("../views/page/about", { title, layout, page, pages, url });
};

exports.updateEnv = async (req, res) => {
  const entries = Object.entries(req.body);
  for (const [key, value] of entries) {
    await Env.update({ value }, { where: { name: key } });
  }

  req.flash("alert", "success");
  req.flash("message", "Data berhasil diubah.");
  return res.redirect("/setting");
};

exports.product = async (req, res) => {
  const DIGIFLAZZ_ENDPOINT = process.env.DIGIFLAZZ_ENDPOINT;
  const DIGIFLAZZ_USERNAME = await getEnv("DIGIFLAZZ_USERNAME");
  const DIGIFLAZZ_KEY = await getEnv("DIGIFLAZZ_KEY");
  const sign = md5(`${DIGIFLAZZ_USERNAME}${DIGIFLAZZ_KEY}pricelist`);

  const response = await axios.post(`${DIGIFLAZZ_ENDPOINT}/price-list`, {
    cmd: "prepaid",
    username: DIGIFLAZZ_USERNAME,
    sign,
  });

  // FIXME: Remove this
  console.log(
    "🚀 ~ file: web.controller.js:259 ~ exports.product= ~ response.data.data:",
    response.data.data
  );

  res.render("../views/page/product", {
    url: "/product",
    title: "Produk",
    layout: "layout/master",
    products: response.data.data,
  });
};

exports.categories = async (req, res) => {
  const categories = await Category.findAll();

  res.render("../views/page/categories/index", {
    url: "/categories",
    title: "Kategori",
    layout: "layout/master",
    categories,
  });
};
