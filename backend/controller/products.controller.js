const Products = require("../model/producets.model");

const createProduct = async (req, res) => {
  try {
    const { productTitle, productSubTitle, price, productImage } = req.body;

    const product = await Products.create({
      productTitle,
      productSubTitle,
      price,
      productImage,
    });
    if (!product) {
      res.status(401).json("Product Added failed");
    }
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json("Product Added failed", error);
  }
};

module.exports = {
  createProduct,
};
