module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("payments", {
    payment_id: {
      type: Sequelize.STRING,
    },
    bill_link: {
      type: Sequelize.STRING,
    },
    bill_link_id: {
      type: Sequelize.INTEGER(10),
    },
    bill_title: {
      type: Sequelize.STRING,
    },
    sender_name: {
      type: Sequelize.STRING,
    },
    sender_bank: {
      type: Sequelize.STRING,
    },
    amount: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.STRING,
    },
    sender_bank_type: {
      type: Sequelize.STRING,
    },
    token: {
      type: Sequelize.STRING,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    type: {
      type: Sequelize.STRING(6),
    }
  });

  return Payment;
};
