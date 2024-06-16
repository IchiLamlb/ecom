const express = require("express");
const { authAdmin, admin } = require("../../middlewares/auth.middleware");
const productController = require("../../controllers/product.controller");

const route = express.Router();

route.post("/item/shop", productController.getProductByShop);
route.get("/item/articles", productController.getArticles);
route.get("/item/articles_by_id", productController.getArticleById);
route.post("/item/article", [authAdmin, admin], productController.createArticle);
route.get("/item/products", productController.getProducts);
route.post("/item/update/:id", [authAdmin, admin], productController.updateArticle);
route.get("/item/searchProduct/:name", productController.searchProductByName);
route.get("/item/delete/:id", productController.delete);

module.exports = route;
