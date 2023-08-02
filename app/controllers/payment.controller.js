const axios = require("axios");
const db = require("../models");
const { generateReferenceNumber } = require("../helpers/generator");
const Bill = db.bill;
const Payment = db.payment;
const getEnv = db.getEnv;
const md5 = require("md5");

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
    const { user_id, payload } = req.body
    const response = await axios.post(`${process.env.FLIP_API_URL}/v2/pwf/bill`, payload, await getRequestConfig())
    const { id } = await Payment.create({ status: 'PENDING', bill_link_id: response.data.link_id })
    const bill = await Bill.create({...{paymentId: id}, ...{no_ref: generateReferenceNumber()}, ...{user_id}, ...response.data})
    res.send(bill)
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
      },
      order: [['createdAt', 'DESC']],
    });
    res.send(bills);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.myBill = async (req, res) => {
  try {
    const { user_id, bill_id } = req.query;
    if (!user_id || !bill_id) {
      throw new Error("Query user_id atau bill_id tidak ditemukan!");
    }
    const bill = await Bill.findOne({
      where: {
        user_id,
        id: bill_id
      },
      include: {
        model: db.payment,
        as: 'payment',
      },
    })
    console.log(bill)
    res.send(bill)
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
};

exports.myBalance = async (req, res) => {
  try {
    const { user_id } = req.query
    if (!user_id) {
      throw new Error("Query user_id tidak ditemukan!");
    }
    const bills = await Bill.findAll({
      where: {
        user_id,
      },
      include: {
        model: db.payment,
        as: 'payment',
      },
    })
    let balance = 0
    bills.forEach(e => {
      if(e.payment.status == 'SUCCESSFUL') {
        if(e.payment.type == 'DEBIT') {
          balance = balance + e.payment.amount
        }
        if(e.payment.type == 'KREDIT') {
          balance = balance - e.payment.amount
        }
      }
    });
    res.status(200).send({balance})
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
}

exports.topup = async (req, res) => {
  try {
    const { buyer_sku_code, customer_no, ref_id } = req.body
  
    const DIGIFLAZZ_ENDPOINT = process.env.DIGIFLAZZ_ENDPOINT;
    const DIGIFLAZZ_USERNAME = await getEnv("DIGIFLAZZ_USERNAME");
    const DIGIFLAZZ_KEY = await getEnv("DIGIFLAZZ_KEY");
    const sign = md5(`${DIGIFLAZZ_USERNAME}${DIGIFLAZZ_KEY}${ref_id}`);
  
    const response = await axios.post(`${DIGIFLAZZ_ENDPOINT}/transaction`, {
      username: DIGIFLAZZ_USERNAME,
      buyer_sku_code,
      customer_no,
      ref_id,
      sign,
    });
    res.send(response.data.data)
  } catch (error) {
    console.log(error)
    res.status(error.response?.status || 500).send(error.response?.data?.data || error.response)
  }
}
