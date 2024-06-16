const express = require("express");
const { authAdmin, admin } = require("../../middlewares/auth.middleware");
const typeController = require("../../controllers/type.controller");

const route = express.Router();

route.post("/item/type", [authAdmin, admin], typeController.create);
route.get("/item/types", typeController.getAll);
route.get("/type/delete/:id", typeController.delete);
route.post("/type/update/:id", [authAdmin, admin], typeController.update);

module.exports = route;
