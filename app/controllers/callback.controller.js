const db = require("../models");
const Payment = db.payment;

exports.acceptPayment = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      console.log('--- Inisialisasi Callback Berhasil ---')
      return res.send(req.body)
    }
    const { data, token } = req.body
    paymentData = JSON.parse(data)
    await Payment.create({
      payment_id: paymentData.id,
      bill_link: paymentData.bill_link,
      bill_link_id: paymentData.bill_link_id,
      bill_title: paymentData.bill_title,
      sender_name: paymentData.sender_name,
      sender_bank: paymentData.sender_bank,
      amount: paymentData.amount,
      status: paymentData.status,
      sender_bank_type: paymentData.sender_bank_type,
      token,
      created_at: paymentData.created_at,
    })
    res.send(req.body)
  } catch (error) {
    console.log(error)
    res.status(error.response.status).send(error.message);
  }
};