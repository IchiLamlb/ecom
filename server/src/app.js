require("dotenv/config");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const morgan = require("morgan");
const path = require("path");

const app = express();

// Init Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));

// Init Database
require("./db/mongo.init");
require("./models/user.model");
require("./models/brand.model");
require("./models/wood.model");
require("./models/product.model");
require("./models/payment.model");

// Init Routes
app.use("/", require("./routes"));

module.exports = app;
