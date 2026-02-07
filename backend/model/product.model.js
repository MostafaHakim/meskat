// const mongoose = require("mongoose");

// const variantSchema = new mongoose.Schema(
//   {
//     color: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     size: {
//       type: String,
//       required: true,
//       trim: true, // 6/7, 7/8, King etc
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     stock: {
//       type: Number,
//       default: 0, // কত পিস আছে
//     },
//     image: {
//       type: String, // এই color/size এর ছবি
//       default: "",
//     },
//     sku: {
//       type: String, // Optional product code
//     },
//   },
//   { _id: true },
// );

// const productSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true, // "Mosquito Net"
//       trim: true,
//     },

//     description: {
//       type: String,
//     },

//     category: {
//       type: String, // Mosquito Net, Bedding, Curtain
//     },

//     baseImage: {
//       type: String, // Default product image
//     },

//     variants: [variantSchema], // 🔥 Multi color & size

//     isActive: {
//       type: Boolean,
//       default: true,
//     },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admin",
//     },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },

  images: [
    {
      type: String, // Cloudinary URL
      required: true,
    },
  ],

  stock: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: String,

    category: {
      type: String,
      required: true,
    },

    variants: [variantSchema],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
