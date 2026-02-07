const express = require("express");
const { createProduct } = require("../controller/products.controller");
const router = express.Router();

router.post("/", createProduct);

module.exports = router;
