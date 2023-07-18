const axios = require('axios')
const db = require("../models");
const Bill = db.bill;

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
    await Bill.create({...{user_id}, ...response.data})
    res.send(response.data)
  } catch (error) {
    console.log(error)
    res.status(error.response.status).send(error.response.data);
  }
};