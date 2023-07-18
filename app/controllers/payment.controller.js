const axios = require('axios')

const requestConfig = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Basic ${process.env.API_SECRET_KEY}:`
  }
};

exports.createBill = async (req, res) => {
  try {
    console.log(requestConfig)
    const response = await axios.post('https://bigflip.id/api/v2/pwf/bill', null, requestConfig)
    // console.log(response)
    res.send(response);
  } catch (error) {
    res.status(error.response.status).send({ message: error.message });
  }
};