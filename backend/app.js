require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5001;

const orderRoute = require("./router/order.route");
const productRoute = require("./router/product.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Welcole to Mesket");
});

app.use("/api/orders", orderRoute);
app.use("/api/products", productRoute);

app.listen(PORT, () => {
  console.log("server is running");
});

module.exports = app;
