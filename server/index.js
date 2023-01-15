const express = require("express");
const SSLCommerzPayment = require("sslcommerz");
var bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const sslCommerzRoutes = require("./routes/sslRoutes.js");
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

// routes
app.use("/api/payment", sslCommerzRoutes);

app.listen(process.env.PORT, () => {
  console.log("server is running", process.env.PORT);
});
