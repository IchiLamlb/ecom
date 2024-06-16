const moment = require("moment");
const { User } = require("../models/user.model");
const { Product } = require("../models/product.model");
const { Payment } = require("../models/payment.model");
const { sendEmail } = require("../utils/mail");
const mongoose = require("mongoose");
const SHA1 = require("crypto-js/sha1");
const async = require("async");

class UserService {
    static register(payload, res) {
        const user = new User(payload);

        return user.save((err, doc) => {
            if (err) return res.json({ success: false, err: err });
            sendEmail(doc.email, doc.name, null, "welcome");
            res.status(200).json({
                success: true,
                userdata: doc,
            });
        });
    }

    static async login({ email, password }, res) {
        User.findOne({ email: email }, (err, user) => {
            if (!user)
                return res.json({
                    loginSuccess: false,
                    loginAdminSuccess: false,
                    message: "Auth failes, email not found",
                });

            // check password
            user.comparePassword(password, (err, isMatch) => {
                // if (!isMatch)
                //     return res.json({
                //         loginSuccess: false,
                //         loginAdminSuccess: false,
                //         message: "Password is wrong",
                //     });

                // generate Token
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);

                    if (user.role === 1) {
                        return res.cookie("ad_auth", user.token).status(200).json({
                            loginAdminSuccess: true,
                            role: user.role,
                        });
                    } else {
                        return res.cookie("w_auth", user.token).status(200).json({
                            loginSuccess: true,
                            role: user.role,
                        });
                    }
                });
            });
        });
    }

    static async logout(id, res) {
        User.findByIdAndUpdate(
            {
                _id: id,
            },
            { token: "" },
            (err, doc) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true,
                });
            }
        );
    }

    static async updateProfile(id, body, res) {
        User.findOneAndUpdate(
            { _id: id },
            {
                $set: body,
            },
            { new: true },
            (err, doc) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true,
                });
            }
        );
    }

    static async getAll(res) {
        User.find({}, (err, users) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(users);
        });
    }

    static async updateById(id, payload, res, next) {
        User.findByIdAndUpdate(id, payload, (err, user) => {
            if (err) return next(err);
            return res.status(200).json({
                success: true,
                user,
            });
        });
    }

    static async resetUser(email, res) {
        return User.findOne({ email }, (err, user) => {
            if (!user) {
                return res.json({
                    success: false,
                    message: "Sorry, token bad please try again!.",
                });
            }
            user.generateResetToken((err, user) => {
                if (err) return res.json({ success: false, err });
                sendEmail(user.email, user.name, null, "reset_password", user);
                return res.json({ success: true });
            });
        });
    }

    static async resetPassword({ resetToken, password }, res) {
        const today = moment().startOf("day").valueOf();

        return User.findOne(
            {
                resetToken: resetToken,
                resetTokenExp: {
                    $gte: today,
                },
            },
            (err, user) => {
                if (!user)
                    return res.json({
                        success: false,
                        message: "Sorry, token bad please try again!.",
                    });

                user.password = password;
                user.resetToken = "";
                user.resetTokenExp = "";

                user.save((err, doc) => {
                    if (err) return res.json({ success: false, err });
                    return res.status(200).json({
                        success: true,
                    });
                });
            }
        );
    }

    static async updatePassword(id, { password, newpassword }, res) {
        User.findOneAndUpdate({ _id: id }, { new: true }, (err, user) => {
            if (!user)
                return res.json({
                    success: false,
                    message: "Sorry, token bad please try again!.",
                });

            user.comparePassword(password, (err, isMatch) => {
                if (!isMatch)
                    return res.json({ success: false, message: "Password cũ không khớp!" });

                user.password = newpassword;

                user.save((err, doc) => {
                    if (err) return res.json({ success: false, err });

                    return res.status(200).send({
                        success: true,
                    });
                });
            });
        });
    }

    static addToCart({ userId, productId, quantity, price }, res) {
        return User.findOne({ _id: userId }, (err, doc) => {
            let duplicate = false;

            doc.cart.forEach((item) => {
                if (item.id == productId) {
                    duplicate = true;
                }
            });

            if (duplicate) {
                User.findOneAndUpdate(
                    {
                        _id: userId,
                        "cart.id": mongoose.Types.ObjectId(productId),
                    },
                    {
                        $inc: { "cart.$.quantity": quantity ? quantity : 1 },
                    },
                    { new: true },
                    (err, user) => {
                        if (err) return res.json({ success: false, err });

                        const cart = user.cart;
                        const array = cart.map((item) => {
                            return mongoose.Types.ObjectId(item.id);
                        });

                        Product.find({ _id: { $in: array } })
                            .populate("brand")
                            .populate("wood")
                            .exec((err, cartDetail) => {
                                return res.status(200).json({
                                    cartDetail,
                                    cart,
                                });
                            });
                    }
                );
            } else {
                User.findOneAndUpdate(
                    { _id: userId },
                    {
                        $push: {
                            cart: {
                                id: mongoose.Types.ObjectId(productId),
                                quantity: quantity ? quantity : 1,
                                price: mongoose.Types.ObjectId(price),
                                date: Date.now(),
                            },
                        },
                    },
                    { new: true },
                    (err, user) => {
                        if (err) return res.json({ success: false, err });

                        const cart = user.cart;
                        const array = cart.map((item) => {
                            return mongoose.Types.ObjectId(item.id);
                        });

                        Product.find({ _id: { $in: array } })
                            .populate("brand")
                            .populate("wood")
                            .exec((err, cartDetail) => {
                                return res.status(200).json({
                                    cartDetail,
                                    cart,
                                });
                            });
                    }
                );
            }
        });
    }

    static updateCart({ userId, productId, key }, res) {
        return User.findOne({ _id: userId }, (err, doc) => {
            let duplicate = false;

            doc.cart.forEach((item) => {
                if (item.id == productId) {
                    duplicate = true;
                }
            });

            if (duplicate) {
                User.findOneAndUpdate(
                    {
                        _id: userId,
                        "cart.id": mongoose.Types.ObjectId(productId),
                    },
                    {
                        $inc: { "cart.$.quantity": key === 1 ? 1 : -1 },
                    },
                    { new: true },
                    (err, user) => {
                        let cart = user.cart;
                        let array = cart.map((item) => {
                            return mongoose.Types.ObjectId(item.id);
                        });
                        Product.find({ _id: { $in: array } })
                            .populate("brand")
                            .populate("wood")
                            .exec((err, cartDetail) => {
                                return res.status(200).json({
                                    cartDetail,
                                    cart,
                                });
                            });
                    }
                );
            }
        });
    }

    static removeFromCart({ userId, cardId }, res) {
        return User.findOneAndUpdate(
            { _id: userId },
            { $pull: { cart: { id: mongoose.Types.ObjectId(cardId) } } },
            { new: true },
            (err, doc) => {
                let cart = doc.cart;
                let array = cart.map((item) => {
                    return mongoose.Types.ObjectId(item.id);
                });

                Product.find({ _id: { $in: array } })
                    .populate("brand")
                    .populate("wood")
                    .exec((err, cartDetail) => {
                        return res.status(200).json({
                            cartDetail, // list products
                            cart,
                        });
                    });
            }
        );
    }

    static successBuy({ cartDetail, user, paymentData, amount }, res) {
        let history = [];
        let transactionData = {};

        const date = new Date();
        const po = `PO-${date.getSeconds()}${date.getMilliseconds()}-${SHA1(user._id)
            .toString()
            .substring(0, 8)}`;

        // user history
        cartDetail.forEach((item) => {
            history.push({
                porder: po,
                dateOfPurchase: Date.now(),
                name: item.name,
                brand: item.brand.name,
                id: item._id,
                price: item.price,
                quantity: item.quantityCart,
                paymentId: paymentData.paymentID,
                paymentMethod: paymentData.method,
            });
        });

        // PAYMENTS DASH
        transactionData.user = {
            id: user._id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
        };

        transactionData.data = {
            ...paymentData,
            porder: po,
        };

        transactionData.product = history;
        transactionData.amount = amount;

        return User.findOneAndUpdate(
            { _id: user._id },
            { $push: { history: history }, $set: { cart: [] } },
            { new: true },
            (err, user) => {
                if (err) return res.json({ success: false, err });

                const payment = new Payment(transactionData);

                payment.save((err, doc) => {
                    if (err) return res.json({ success: false, err });
                    let products = [];
                    doc.product.forEach((item) => {
                        products.push({ id: item.id, quantity: item.quantity });
                    });

                    async.eachSeries(
                        products,
                        (item, callback) => {
                            Product.update(
                                { _id: item.id },
                                {
                                    $inc: {
                                        sold: item.quantity,
                                        quantity: -item.quantity,
                                    },
                                },
                                { new: false },
                                callback
                            );
                        },
                        (err) => {
                            if (err) return res.json({ success: false, err });

                            sendEmail(user.email, user.name, null, "purchase", transactionData);

                            return res.status(200).json({
                                success: true,
                                cart: user.cart,
                                cartDetail: [],
                            });
                        }
                    );
                });
            }
        );
    }
}

module.exports = UserService;
