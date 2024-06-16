const express = require("express");
const paymentController = require("../../controllers/payment.controller");
const { authAdmin, admin } = require("../../middlewares/auth.middleware");

const route = express.Router();

route.post("/payment", paymentController.requestPayment);
route.get("/api/payments/getall", paymentController.getAll);

route.post("/api/payment/update/:id", [authAdmin, admin], paymentController.updatePayment);
route.get("/api/payment/delete/:id", paymentController.delete);

route.post("/api/payment/dateRange", paymentController.dateRange);
route.post("/api/payment/week", paymentController.week);
route.post("/api/payment/year", paymentController.year);
route.post("/api/payment/product", paymentController.productReport);
route.post("/api/payment/customer", paymentController.customerReport);

module.exports = route;
