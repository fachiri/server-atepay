const db = require("../models");
const Slider = db.slider;

exports.setting = async (req, res) => {
  const page = '../views/page/setting'
  const title = 'Pengaturan'
  const layout = 'layout/master'
  let sliders
  try {
    sliders = await Slider.findAll()
  } catch (error) {
    req.flash('alert', 'danger')
    req.flash('message', error.message)
  }
  res.render(page, {title, layout, sliders})
};

exports.sliderAdd = async (req, res) => {
  try {
    const uploadedFile = req.file;

    if (!uploadedFile) {
      throw new Error('Please choose an image file.')
    }
    
    const maxOrderSlider = await Slider.max('order');
    const newOrder = (maxOrderSlider !== null) ? maxOrderSlider + 1 : 0;
    await Slider.create({
      name: uploadedFile.filename,
      order: newOrder
    });

    req.flash('alert', 'success')
    req.flash('message', 'Data saved successfully.')
  } catch (error) {
    req.flash('alert', 'danger')
    req.flash('message', error.message)
  }
  return res.redirect('/setting')
};

