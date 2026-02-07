require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5001;

const productRoute = require("./router/products.route");
const orderRoute = require("./router/order.route");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Welcole to Mesket");
});

app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);

app.listen(PORT, () => {
  console.log("server is running");
});

module.exports = app;
