const db = require("../models");
const Payment = db.payment;
const Notification = db.notification;
const Bill = db.bill;

exports.acceptPayment = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      console.log('--- Inisialisasi Callback Berhasil ---')
      return res.send(req.body)
    }
    const { data, token } = req.body
    paymentData = JSON.parse(data)
    await Payment.update({
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
      type: 'DEBIT'
    }, { 
      where: {
        bill_link_id: paymentData.bill_link_id
      }
    })
    const bill = await Bill.findOne({ where: { link_id: paymentData.bill_link_id }})
    let title = 'Pembayaran Berhasil'
    let body = 'Pembayaran anda telah berhasil dikonfirmasi. Terima kasih atas pembayaran Anda! Kami senang dapat melayani Anda dan memberikan layanan terbaik. Jangan ragu untuk menghubungi kami jika Anda membutuhkan bantuan lebih lanjut. Semoga transaksi ini membantu mencapai tujuan Anda.';
    if(paymentData.status == 'FAILED') {
      title = 'Pembayaran Gagal'
      body = 'Maaf, pembayaran anda gagal. Kami menyarankan untuk memeriksa kembali informasi pembayaran yang Anda berikan. Jika Anda mengalami masalah atau butuh bantuan, silakan hubungi tim dukungan pelanggan kami. Kami berkomitmen untuk membantu Anda menyelesaikan masalah ini dengan cepat dan efisien. Terima kasih atas pengertian Anda.';
    }
    await Notification.create({
      title,
      body,
      type: 'Pembayaran',
      data: JSON.stringify({
        no_ref: bill.no_ref,
        amount: paymentData.amount,
        paymentMethod: paymentData.sender_bank_type,
        paymentDate: paymentData.created_at
      }),
      userId: bill.user_id
    })
    res.send(req.body)
  } catch (error) {
    console.log(error)
    res.status(error.response.status).send(error.message);
  }
};