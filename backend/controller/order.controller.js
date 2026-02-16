const Order = require("../model/order.model");
const { bizSdk, pixelId } = require("../config/facebook");
const crypto = require("crypto");

const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      mobileNumber,
      address,
      paymentMethod,
      items,
      totalAmount,
      transactionId,
      deliveryCharge,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !customerName ||
      !mobileNumber ||
      !address ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "অনুগ্রহ করে সকল তথ্য পূরণ করুন",
      });
    }

    // Calculate total if not provided
    const calculatedTotal = items.reduce((sum, item) => {
      return sum + item.quantity * (item.unitPrice || 1200);
    }, deliveryCharge || 0);

    // Create order
    const order = new Order({
      customerName,
      mobileNumber,
      address,
      paymentMethod: paymentMethod || "cash",
      items: items.map((item) => ({
        productColor: item.color || item.productColor,
        productSize: item.size || item.productSize,
        quantity: item.quantity,
        unitPrice: item.unitPrice || 1200,
        totalPrice: item.quantity * (item.unitPrice || 1200),
      })),
      totalAmount: totalAmount || calculatedTotal,
      orderStatus: "pending",
      transactionId,
      deliveryCharge: deliveryCharge || 0,
      notes: notes || "",
    });

    const savedOrder = await order.save();
    // Send SMS notification (example - you'll need to integrate with SMS gateway)
    // await this.sendOrderConfirmationSMS(mobileNumber, savedOrder.orderNumber);

    const userData = new bizSdk.UserData(
      null,
      null,
      null,
      mobileNumber,
      customerName.split(" ")[0],
      customerName.split(" ")[1],
      null,
      null,
      null,
      null,
      req.ip,
      req.get("User-Agent"),
    );
    const serverEvent = new bizSdk.ServerEvent(
      "Purchase",
      {
        value: savedOrder.totalAmount,
        currency: "BDT",
        order_id: savedOrder._id.toString(),
      },
      userData,
      Date.now() / 1000,
    );

    const eventsData = [serverEvent];
    const eventRequest = new bizSdk.EventRequest(eventsData, pixelId);
    eventRequest.execute().then(
      (response) => {
        console.log("Facebook event sent:", response);
      },
      (err) => {
        console.error("Error sending Facebook event:", err);
      },
    );

    res.status(201).json({
      success: true,
      message: "অর্ডার সফলভাবে তৈরি হয়েছে!",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "অর্ডার তৈরি করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Get all orders (with pagination and filtering)
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
      search,
    } = req.query;

    const query = {};

    // Filter by status
    if (status) {
      query.orderStatus = status;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Search by customer name, mobile, or order number
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
        { orderNumber: { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "অর্ডার লোড করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "অর্ডার পাওয়া যায়নি",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({
      success: false,
      message: "অর্ডার লোড করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Get orders by mobile number
const getOrdersByMobile = async (req, res) => {
  try {
    const { mobileNumber } = req.params;

    const orders = await Order.find({ mobileNumber })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get Orders by Mobile Error:", error);
    res.status(500).json({
      success: false,
      message: "অর্ডার লোড করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, notes } = req.body;

    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "অর্ডার স্ট্যাটাস প্রয়োজন",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus,
        notes: notes || "",
      },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "অর্ডার পাওয়া যায়নি",
      });
    }

    // Send status update SMS
    await this.sendStatusUpdateSMS(
      order.mobileNumber,
      order.orderNumber,
      orderStatus,
    );

    res.status(200).json({
      success: true,
      message: "অর্ডার স্ট্যাটাস আপডেট করা হয়েছে",
      data: order,
    });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({
      success: false,
      message: "অর্ডার আপডেট করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Delete order (soft delete)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "অর্ডার পাওয়া যায়নি",
      });
    }

    res.status(200).json({
      success: true,
      message: "অর্ডার ডিলিট করা হয়েছে",
      data: order,
    });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({
      success: false,
      message: "অর্ডার ডিলিট করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const stats = await Order.aggregate([
      {
        $facet: {
          daily: [
            { $match: { orderDate: { $gte: startOfDay } } },
            { $count: "count" },
          ],
          monthly: [
            { $match: { orderDate: { $gte: startOfMonth } } },
            { $count: "count" },
          ],
          yearly: [
            { $match: { orderDate: { $gte: startOfYear } } },
            { $count: "count" },
          ],
          byStatus: [{ $group: { _id: "$orderStatus", count: { $sum: 1 } } }],
          totalRevenue: [
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "স্ট্যাটিস্টিক্স লোড করতে সমস্যা হয়েছে",
      error: error.message,
    });
  }
};

module.exports = {
  getOrderStats,
  deleteOrder,
  updateOrderStatus,
  getOrdersByMobile,
  getOrderById,
  getAllOrders,
  createOrder,
};
