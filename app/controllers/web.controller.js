const bcrypt = require("bcryptjs");
const db = require("../models");
const User = db.user;
const Slider = db.slider;
const Page = db.page;

exports.setting = async (req, res) => {
  const page = "../views/page/setting";
  const title = "Pengaturan";
  const layout = "layout/master";
  let sliders;
  let pages;
  try {
    sliders = await Slider.findAll({
      order: [["order", "ASC"]],
    });
    pages = await Page.findAll({
      id: [["id", "ASC"]],
    });
  } catch (error) {
    req.flash("alert", "danger");
    req.flash("message", error.message);
  }
  res.render(page, { title, layout, sliders, pages });
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
