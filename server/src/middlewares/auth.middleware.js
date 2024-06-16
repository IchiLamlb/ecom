const { User } = require("../models/user.model");

let auth = (req, res, next) => {
    const token = req.cookies.w_auth;

    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user)
            return res.json({
                isAuth: false,
                error: true,
            });

        req.token = token;
        req.user = user;
        next();
    });
};

const admin = (req, res, next) => {
    if (req.user.role === 0) {
        return res.send({
            isAdmin: "You are not allowed, get out now",
        });
    }

    next();
};

const authAdmin = (req, res, next) => {
    const token = req.cookies.ad_auth;

    User.findByToken(token, (err, user) => {
        if (err) throw err;

        if (!user)
            return res.json({
                isAuth: false,
                error: true,
            });

        req.token = token;
        req.user = user;
        next();
    });
};

module.exports = { authAdmin, admin, auth };
