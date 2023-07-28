const axios = require('axios')
const db = require("../models");
const Bill = db.bill;
const Payment = db.payment;

const requestConfig = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  auth: {
    username: process.env.FLIP_API_SECRET_KEY,
    password: ''
  }
};

exports.createBill = async (req, res) => {
  try {
    const { user_id, payload } = req.body
    const response = await axios.post(`${process.env.FLIP_API_URL}/v2/pwf/bill`, payload, requestConfig)
    const { id } = await Payment.create({ status: 'PENDING', bill_link_id: response.data.link_id })
    await Bill.create({...{paymentId: id}, ...{user_id}, ...response.data})
    res.send(response.data)
  } catch (error) {
    console.log(error)
    res.status(error.response.status).send(error.response.data);
  }
};

exports.myBills = async (req, res) => {
  try {
    const { user_id } = req.query
    if (!user_id) {
      throw new Error('Query user_id tidak ditemukan!')
    }
    const bills = await Bill.findAll({
      where: {
        user_id
      },
      include: {
        model: db.payment,
        as: 'payment',
        // required: false
      },
    })
    res.send(bills)
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: error.message });
  }
};