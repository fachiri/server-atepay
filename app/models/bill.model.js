module.exports = (sequelize, Sequelize) => {
  const Bill = sequelize.define("bills", {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    link_id: {
      type: Sequelize.INTEGER(10),
      allowNull: false
    },
    link_url: {
      type: Sequelize.STRING,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    redirect_url: {
      type: Sequelize.STRING,
      allowNull: false
    },
    expired_date: {
      type: Sequelize.DATE,
      allowNull: false,
      get() {
        const date = this.getDataValue('expired_date');
        if (date) {
          // Format the date to "YYYY-MM-DD HH:mm"
          const formattedDate = date.toISOString().slice(0, 16).replace('T', ' ');
          return formattedDate;
        }
        return null;
      },
      set(value) {
        if (value) {
          // Parse the date from "YYYY-MM-DD HH:mm" format
          const parsedDate = new Date(value.replace(' ', 'T'));
          this.setDataValue('expired_date', parsedDate);
        }
      },
    },
    created_from: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
    is_address_required:{
      type: Sequelize.INTEGER(1),
      allowNull: false
    },
    is_phone_number_required:{
      type: Sequelize.INTEGER(1),
      allowNull: false
    },
    step:{
      type: Sequelize.INTEGER(1),
      allowNull: false
    }
  });

  return Bill;
};
