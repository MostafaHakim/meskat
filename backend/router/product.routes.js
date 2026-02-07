const express = require("express");
const upload = require("../middleware/upload");
const {
  createProduct,
  getAllProducts,
  getProductById,
} = require("../controller/product.controller");

const router = express.Router();

// ➕ Create New Product
router.post("/create", upload.any(), createProduct);

// 📦 Get all products
router.get("/", getAllProducts);

router.get("/:id", getProductById);

module.exports = router;
