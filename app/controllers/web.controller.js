const db = require("../models");
const Slider = db.slider;

exports.sliderAdd = async (req, res) => {
  try {
    const uploadedFile = req.file;
    
    await Slider.create({
      name: uploadedFile.filename
    })

    req.flash('alert', 'success')
    req.flash('message', 'Slider berhasil ditambahkan!')
  } catch (error) {
    req.flash('alert', 'danger')
    req.flash('message', error.message)
  }
  res.redirect('/setting')
};

