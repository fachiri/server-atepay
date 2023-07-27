module.exports = (sequelize, Sequelize) => {
  const Payment = sequelize.define("payments", {
    payment_id: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bill_link: {
      type: Sequelize.STRING,
      allowNull: false
    },
    bill_link_id: {
      type: Sequelize.INTEGER(10),
      allowNull: false
    },
    bill_title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sender_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sender_bank: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sender_bank_type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
  });

  return Payment;
};
