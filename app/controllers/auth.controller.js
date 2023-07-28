const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const getEnv = db.getEnv;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const twilio = require("twilio");
const { OTP } = require("../consts");

const SECRET = process.env.SECRET;

exports.signup = async (req, res) => {
  // Save User to Database
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    if (req.body.roles) {
      const roles = await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      });

      const result = user.setRoles(roles);
      if (result) res.send({ message: "Registrasi Berhasil!" });
    } else {
      // user has role = 1
      const result = user.setRoles([1]);
      if (result) res.send({ message: "Registrasi Berhasil!!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).send({ message: "Email atau Password salah!" });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(404).send({
        message: "Email atau Password salah!",
      });
    }
    let authorities = [];
    const roles = await user.getRoles();
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    return res.status(200).send({
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        roles: authorities,
      },
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "Anda telah Logout!",
    });
  } catch (err) {
    this.next(err);
  }
};

const OTP_SMS = async (phoneNumber, otp) => {
  const TWILIO_ACCOUNT_SID = await getEnv("TWILIO_ACCOUNT_SID");
  const TWILIO_AUTH_TOKEN = await getEnv("TWILIO_AUTH_TOKEN");
  const TWILIO_PHONE_NUMBER = await getEnv("TWILIO_PHONE_NUMBER");

  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

  return client.messages.create({
    body: `Kode OTP anda adalah : ${otp}`,
    from: TWILIO_PHONE_NUMBER,
    to: phoneNumber,
  });
};

// FIXME: implement this
const OTP_WHATSAPP = async (phoneNumber, otp) => {
  return new Promise((resolve, reject) => {
    resolve("success");
  });
};

// FIXME: implement this
const OTP_EMAIL = async (email, otp) => {
  return new Promise((resolve, reject) => {
    resolve("success");
  });
};

//sendotp
exports.sendotp = async (req, res) => {
  const { phoneNumber, email, id, type } = req.body;

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  await User.update({ code: otp }, { where: { id } });

  switch (type) {
    case OTP.SMS:
      OTP_SMS(phoneNumber, otp)
        .then((message) => {
          res.status(200).json({ message: "Kode OTP Telah Terkirim!" });
        })
        .catch((error) => {
          res.status(500).json({ message: "Gagal Mengirimkan Kode OTP!" });
        });
      break;

    case OTP.WHATSAPP:
      OTP_WHATSAPP(phoneNumber, otp)
        .then((message) => {
          res.status(200).json({ message: "Kode OTP Telah Terkirim!" });
        })
        .catch((error) => {
          res.status(500).json({ message: "Gagal Mengirimkan Kode OTP!" });
        });
      break;

    case OTP.EMAIL:
      OTP_EMAIL(email, otp);
      break;
  }
};

// verifyotp
exports.verifytoken = async (req, res) => {
  const { id, code } = req.body;
  try {
    const user = await User.findOne({ where: { id, code } });

    if (!user) return res.status(401).json({ message: "Invalid OTP!" });

    const _1HOUR = 3600; //seconds
    const token = jwt.sign({ id: user.id }, SECRET, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: _1HOUR * 24,
    });

    await User.update({ code: null }, { where: { id } });
    res.status(200).json({
      message: "Verifikasi Berhasil!",
      token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//buatpin
exports.createpin = async (req, res) => {
  const { id, pin } = req.body;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }
    const hashedPin = await bcrypt.hash(pin, 8);
    await user.update({
      pin: hashedPin,
      where: { id },
    });
    return res.status(200).json({ message: "Pin berhasil dibuat!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//gantipin
exports.resetpin = async (req, res) => {
  const { id, pin } = req.body;
  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    const hashedPin = await bcrypt.hash(pin, 8);
    await user.update({ pin: hashedPin });

    return res.status(200).json({ message: "Pin berhasil diganti!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//resetpassword
exports.resetpassword = async (req, res) => {
  const { id, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan!" });
    }

    const newHasPassword = await bcrypt.hash(newPassword, 8);

    await user.update({ password: newHasPassword });

    return res.status(200).json({ message: "Password berhasil diganti!" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//checktoken
exports.checktoken = async (req, res) => {
  let token = req.params.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }
  try {
    const decoded = jwt.verify(token, SECRET);
    res.status(200).json({
      message: "token is valid",
      data: decoded,
    });
  } catch (error) {
    res.status(401).json({
      message: "invalid token",
    });
  }
};
