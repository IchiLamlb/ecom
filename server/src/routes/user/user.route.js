const express = require("express");
const userController = require("../../controllers/user.controller");
const { authAdmin, admin, auth } = require("../../middlewares/auth.middleware");
const formidable = require("express-formidable");

const route = express.Router();

route.get("/getAllUsers", userController.getAll);
route.post("/update/:id", [authAdmin, admin], userController.update);
route.post("/reset_user", userController.resetUser);
route.post("/reset_password", userController.resetPassword);
route.post("/update_password", auth, userController.updatePassword);

route.get("/auth", auth, userController.getAuth);
route.get("/authAdmin", authAdmin, userController.getAuth);

route.post("/register", userController.register);
route.post("/login", userController.login);
route.get("/logout", auth, userController.logout);

route.post("/update_profile", auth, userController.updateProfile);
route.post("/addToCart", auth, userController.addToCart);
route.post("/updateCart", auth, userController.updateCart);

route.get("/removeFromCart", auth, userController.removeFromCart);
route.post("/successBuy", auth, userController.successBuy);

route.post("/uploadfile", [auth, admin], userController.uploadFile);
route.post("/uploadimage", [authAdmin, admin, formidable()], userController.uploadImage);
route.get("/removeimage", [authAdmin, admin], userController.removeImage);
route.get("/admin_files", [auth, admin], userController.getFiles);
route.get("/download/:id", [auth, admin], userController.downloadFile);

module.exports = route;
