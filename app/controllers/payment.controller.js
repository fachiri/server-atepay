const axios = require("axios");
const db = require("../models");
const Bill = db.bill;
const Payment = db.payment;
const getEnv = db.getEnv;

async function getRequestConfig() {
  const FLIP_API_SECRET_KEY = await getEnv("FLIP_API_SECRET_KEY");

  return {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: FLIP_API_SECRET_KEY,
      password: "",
    },
  };
}

exports.createBill = async (req, res) => {
  try {
    const { user_id, payload } = req.body;
    const FLIP_API_URL = await getEnv("FLIP_API_URL");
    const requestConfig = await getRequestConfig();
    const response = await axios.post(
      `${FLIP_API_URL}/v2/pwf/bill`,
      payload,
      requestConfig
    );
    const { id } = await Payment.create({
      status: "PENDING",
      bill_link_id: response.data.link_id,
    });
    await Bill.create({
      ...response.data,
      paymentId: id,
      user_id,
    });
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.status(error.response.status).send(error.response.data);
  }
};

exports.myBills = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      throw new Error("Query user_id tidak ditemukan!");
    }
    const bills = await Bill.findAll({
      where: {
        user_id,
      },
      include: {
        model: db.payment,
        as: "payment",
        // required: false
      },
    });
    res.send(bills);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};
