const express = require("express");

const route = express.Router();

route.use("/", require("./payment/payment.route"));
route.use("/api/client", require("./user/user.route"));
route.use("/api", require("./type/type.route"));
route.use("/api", require("./brand/brand.route"));
route.use("/api", require("./product/product.route"));

module.exports = route;
