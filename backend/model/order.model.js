const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bkash", "nogod", "card"],
      default: "cash",
    },
    items: [
      {
        productColor: String,
        productSize: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    orderNumber: {
      type: String,
      unique: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

// // Generate unique order number
// orderSchema.pre("save", async function (next) {
//   if (!this.orderNumber) {
//     const date = new Date();
//     const year = date.getFullYear().toString().slice(-2);
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const day = date.getDate().toString().padStart(2, "0");
//     const count =
//       (await Order.countDocuments({
//         orderDate: {
//           $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
//           $lt: new Date(
//             date.getFullYear(),
//             date.getMonth(),
//             date.getDate() + 1,
//           ),
//         },
//       })) + 1;

//     this.orderNumber = `MN${year}${month}${day}${count.toString().padStart(3, "0")}`;
//   }
//   next();
// });
orderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    const count =
      (await mongoose.model("Order").countDocuments({
        orderDate: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          $lt: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1,
          ),
        },
      })) + 1;

    this.orderNumber = `MN${year}${month}${day}${count
      .toString()
      .padStart(3, "0")}`;
  }
});
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
