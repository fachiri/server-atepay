const db = require("../models");
const Category = db.category;
const Product = db.product;

module.exports.index = async (req, res) => {
  let categories = await Category.findAll({
    include: [
      {
        model: Product,
        as: "products",
      },
    ],
  });

  categories = categories.map((category) => {
    const brands = [];
    for (const product of category.products) {
      const brand = brands.find((brand) => brand.name === product.brand);
      if (!brand) {
        brands.push({
          name: product.brand,
          products: [product],
        });
      } else {
        brand.products.push(product);
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
    data: categories,
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
