const db = require("../models");
const Category = db.category;
const Product = db.product;

module.exports.index = async (req, res) => {
  const categories = await Category.findAll({
    include: [
      {
        model: Product,
        as: "products",
        attributes: ["brand"],
      },
    ],
  });

  const categoriesWithUniqueBrands = categories.map((category) => {
    const brands = [];
    for (const brand of category.products.map((product) => product.brand)) {
      if (!brands.includes(brand)) {
        brands.push(brand);
      }
    }

    return {
      id: category.id,
      category: category.name,
      brands,
    };
  });

  res.json({
    message: "success",
    data: categoriesWithUniqueBrands,
  });
};

module.exports.getByCategoryAndBrand = async (req, res) => {
  const { categoryId, brand } = req.body;

  const products = await Product.findAll({
    where: {
      categoryId,
      brand,
    },
  });

  return res.json({
    message: "success",
    data: products,
  });
};

module.exports.getByCategoryAndBrand = async (req, res) => {
  const { categoryId, brand } = req.body;

  const products = Product.findAll({
    where: {
      categoryId,
      brand,
    },
  });

  return res.json({
    message: "success",
    data: products,
  });
};
