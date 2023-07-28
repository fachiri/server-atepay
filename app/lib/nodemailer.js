const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

module.exports = ({ to, subject, text, html }) => {
  const message = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(message);
};
