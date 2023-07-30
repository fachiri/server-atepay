const nodemailer = require("nodemailer");

module.exports = (getEnv) => {
  const getTransporter = async () => {
    const EMAIL = await getEnv("EMAIL");
    const EMAIL_PASSWORD = await getEnv("EMAIL_PASSWORD");

    return {
      EMAIL,
      transporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: EMAIL_PASSWORD,
        },
      }),
    };
  };

  return async ({ to, subject, text, html }) => {
    const { transporter, EMAIL } = await getTransporter();

    const message = {
      from: EMAIL,
      to,
      subject,
      text,
      html,
    };

    return transporter.sendMail(message);
  };
};
