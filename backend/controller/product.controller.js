const Product = require("../model/product.model");

const cloudinary = require("../config/cloudinary");

// // ➕ Create New Product
// const createProduct = async (req, res) => {
//   try {
//     const { name, description, category, baseImage, variants } = req.body;

//     if (!name || !variants || variants.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Product name & at least one variant required",
//       });
//     }

//     // Validate variants
//     for (let v of variants) {
//       if (!v.color || !v.size || !v.price) {
//         return res.status(400).json({
//           success: false,
//           message: "Each variant must have color, size & price",
//         });
//       }
//     }

//     const product = await Product.create({
//       name,
//       description,
//       category,
//       baseImage,
//       variants,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Product created successfully",
//       data: product,
//     });
//   } catch (err) {
//     console.error("Create product error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

const createProduct = async (req, res) => {
  try {
    const { name, description, category, variants } = req.body;

    const parsedVariants = JSON.parse(variants); // size, color, stock, price

    const finalVariants = [];

    for (let i = 0; i < parsedVariants.length; i++) {
      const variant = parsedVariants[i];

      const files = req.files.filter(
        (file) => file.fieldname === `variantImages_${i}`,
      );

      let imageUrls = [];

      for (let file of files) {
        const upload = await cloudinary.uploader.upload(file.path);
        imageUrls.push(upload.secure_url);
      }

      finalVariants.push({
        ...variant,
        images: imageUrls,
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      variants: finalVariants,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// 📦 Get all products
const getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, data: products });
};

const getProductById = async (req, res) => {
  console.log(req.params.id);
  const product = await Product.findById(req.params.id);
  res.json(product);
};

module.exports = { createProduct, getAllProducts, getProductById };
