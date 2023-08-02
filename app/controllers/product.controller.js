const db = require("../models");
const Category = db.category;
const Product = db.product;
const Brand = db.brand;

module.exports.index = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Brand,
          as: "categoryBrands",
        },
      ],
    });
  
    res.status(200).send({
      message: "success",
      data: categories,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports.brand = async (req, res) => {
  console.log(req.params)
  const { id } = req.params;
  const brand = await Brand.findOne({
    where: { id },
    include: [
      {
        model: Product,
        as: "brandProducts",
      },
    ],
  });

  return res.json({
    message: "success",
    data: brand,
  });
};
