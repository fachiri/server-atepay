const db = require("../models");
const User = db.user;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { payload } = req.body
    const data = await User.update(
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

exports.show = async (req, res) => {
  try {
    const { id } = req.params
    const data = await User.findOne({
      where: {
        id
      }
    })
    if(!data) {
      throw { statusCode: 404, message: 'Data tidak ditemukan!' };
    }
    res.status(200).send({ message: 'Data berhasil ditemukan!', data });
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
};

exports.changeProfilePicture = async (req, res) => {
  try {
    const uploadedFile = req.file;
    const { id } = req.params
    if (!uploadedFile) {
      throw { statusCode: 404, message: 'Data tidak ditemukan!' };
    }
    const data = await User.update(
      { avatar: uploadedFile.filename },
      { where: { id } }
    );

    res.status(200).send({ message: 'Data berhasil ditemukan!', data });
  } catch (error) {
    console.log(error)
    res.status(error.statusCode || 500).send({ message: error.message });
  }
};
