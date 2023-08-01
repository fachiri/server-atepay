module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    brand: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    seller_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    buyer_sku_code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    buyer_product_status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    seller_product_status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    unlimited_stock: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    multi: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    // FIXME: is this really a string?
    start_cut_off: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    end_cut_off: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  });

  return Product;
};
