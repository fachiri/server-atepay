const db = require("../models");
const Slider = db.slider;

exports.sliders = async (req, res) => {
  try {
    const data = await Slider.findAll()
    if(data == 0) {
      return res.send({message: 'Data tidak ditemukan!', data})
    }
    res.status(200).send({ message: 'Data berhasil ditemukan!', data });
  } catch (error) {
    console.log(error.statusCode)
    res.status(error.statusCode || 500).send({ message: error.message });
  }
};
