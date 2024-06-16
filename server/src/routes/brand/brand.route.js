const express = require("express");
const { authAdmin, admin } = require("../../middlewares/auth.middleware");
const brandController = require("../../controllers/brand.controller");

const route = express.Router();

route.post("/item/brand", [authAdmin, admin], brandController.create);
route.get("/item/brands", brandController.getAll);
route.get("/brand/delete/:id", brandController.delete);
route.post("/brand/update/:id", [authAdmin, admin], brandController.update);

module.exports = route;
