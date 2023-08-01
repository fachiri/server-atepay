const db = require("../models");
const Notification = db.notification;

exports.show = async (req, res) => {
  try {
    const { id } = req.params
    const data = await Notification.findAll({
      where: {
        userId: id
      },
      order: [['createdAt', 'DESC']],
    })
    if(data == 0) {
      throw { statusCode: 404, message: 'Data tidak ditemukan!' };
    }
    res.status(200).send({ message: 'Data berhasil ditemukan!', data });
  } catch (error) {
    console.log(error.statusCode)
    res.status(error.statusCode || 500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { payload } = req.body
    const data = await Notification.update(
      payload,
      { where: { id } }
    )
    if(data == 0) {
      throw { statusCode: 404, message: 'Data tidak ditemukan!' };
    }
    res.status(200).send({ message: 'Data berhasil diupdate!', data });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
};
