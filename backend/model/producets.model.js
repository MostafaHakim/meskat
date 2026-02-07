const mongoose = require("mongoose");
const productsSchema = mongoose.Schema({
  productTitle: {
    type: String,
    required: true,
  },
  productSubTitle: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  productImage: [
    {
      image: String,
      public_id: String,
      imageColor: String,
    },
  ],
});

const Products = mongoose.model("products", productsSchema);
module.exports = Products;
