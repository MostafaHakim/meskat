const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderStats,
  getOrderById,
  getOrdersByMobile,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/order.controller");
const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/stats", getOrderStats);
router.get("/:id", getOrderById);
router.get("/mobile/:mobileNumber", getOrdersByMobile);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
