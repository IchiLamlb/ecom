const stripe = require("../configs/stripe.config");
const { Payment } = require("../models/payment.model");

class PaymentService {
    static async requestPayment({ id, amount }, res) {
        try {
            const payment = await stripe.paymentIntents.create({
                amount,
                currency: "vnd",
                description: "Spatula company",
                payment_method: id,
                confirm: true,
            });
            console.log("Payment", payment);
            res.json({
                message: "Payment successful",
                success: true,
            });
        } catch (error) {
            console.log("Error", error);
            res.json({
                message: "Payment failed",
                success: false,
            });
        }
    }

    static async updatePayment(id, { status, arrivaltime }, res, next) {
        Payment.findById(id, (err, payment) => {
            if (!payment) {
                return next(new Error("could not load Document"));
            } else {
                // do your update here
                payment.status = status;
                payment.arrivaltime = arrivaltime;
                payment
                    .save()
                    .then((payment) => {
                        return res.status(200).json({
                            success: true,
                            payment,
                        });
                    })
                    .catch((err) => {
                        res.status(400).send("unable to update the database");
                    });
            }
        });
    }

    static getAll(res) {
        Payment.find({}, (err, types) => {
            if (err) return res.status(400).send(err);
            return res.status(200).send(types);
        }).sort([["date", "desc"]]);
    }

    static async delete(id, res) {
        Payment.findByIdAndRemove({ _id: id }, (err, product) => {
            if (err) {
                res.json(err);
            } else {
                res.json({ success: true });
            }
        });
    }

    static async dateRange({ end, start }, res) {
        const todayEnd = new Date(end);
        todayEnd.setUTCHours(23);
        todayEnd.setUTCMinutes(59);
        todayEnd.setUTCSeconds(59);
        todayEnd.setUTCMilliseconds(999);

        const nowStart = new Date(Date.now());
        nowStart.setUTCHours(0);
        nowStart.setUTCMinutes(0);
        nowStart.setUTCSeconds(0);
        nowStart.setUTCMilliseconds(0o0);

        const nowEnd = new Date(Date.now());
        nowEnd.setUTCHours(23);
        nowEnd.setUTCMinutes(59);
        nowEnd.setUTCSeconds(59);
        nowEnd.setUTCMilliseconds(999);

        Payment.aggregate([
            {
                $match: {
                    date: {
                        $gte: start ? new Date(start) : new Date(nowStart),
                        $lte: end ? new Date(todayEnd) : new Date(nowEnd),
                    },
                },
            },

            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    amount: { $sum: "$amount" },
                },
            },
        ]).exec((err, results) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({
                size: results.length,
                results,
            });
        });
    }

    static async week(dateInput, res) {
        const date = new Date(dateInput);

        date.setUTCHours(23);
        date.setUTCMinutes(59);
        date.setUTCSeconds(59);
        date.setUTCMilliseconds(999);

        const newDate = new Date(date).getUTCDate() - 7;
        const dateWeek = new Date(date).setUTCDate(newDate);

        Payment.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(dateWeek),
                        $lte: new Date(date),
                    },
                },
            },

            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    amount: { $sum: "$amount" },
                },
            },
        ]).exec((err, results) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({
                size: results.length,
                results,
            });
        });
    }

    static async year(yearInput, res) {
        const yearNow = `${new Date(Date.now()).getUTCFullYear()}-01-01`;
        const newYearNow = new Date(yearNow).getUTCDate() + 365;
        const yearNowNow = new Date(yearNow).setUTCDate(newYearNow);
        const date = new Date(yearInput);
        const year = new Date(date).getUTCDate() + 365;
        const newYear = new Date(date).setUTCDate(year);

        Payment.aggregate([
            {
                $match: {
                    date: {
                        $gte: year ? new Date(date) : new Date(yearNow),
                        $lte: year ? new Date(newYear) : new Date(yearNowNow),
                    },
                },
            },

            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$date" } },
                    amount: { $sum: "$amount" },
                },
            },
        ]).exec((err, results) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({
                size: results.length,
                results,
            });
        });
    }

    static async productReport({ end, start }, res) {
        const todayEnd = new Date(end);
        todayEnd.setUTCHours(23);
        todayEnd.setUTCMinutes(59);
        todayEnd.setUTCSeconds(59);
        todayEnd.setUTCMilliseconds(999);

        const nowStart = new Date(Date.now());
        nowStart.setUTCHours(0);
        nowStart.setUTCMinutes(0);
        nowStart.setUTCSeconds(0);
        nowStart.setUTCMilliseconds(0o0);

        const nowEnd = new Date(Date.now());
        nowEnd.setUTCHours(23);
        nowEnd.setUTCMinutes(59);
        nowEnd.setUTCSeconds(59);
        nowEnd.setUTCMilliseconds(999);

        Payment.aggregate([
            {
                $match: {
                    date: {
                        $gte: start ? new Date(start) : new Date(nowStart),
                        $lte: end ? new Date(todayEnd) : new Date(nowEnd),
                    },
                },
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$product.name",
                    amount: {
                        $sum: {
                            $multiply: ["$product.quantity", "$product.price"], //nhan
                        },
                    },
                    sold: { $sum: "$product.quantity" },
                },
            },
        ]).exec((err, results) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({
                size: results.length,
                results,
            });
        });
    }

    static async customerReport({ end, start }, res) {
        const todayEnd = new Date(end);
        todayEnd.setUTCHours(23);
        todayEnd.setUTCMinutes(59);
        todayEnd.setUTCSeconds(59);
        todayEnd.setUTCMilliseconds(999);

        const nowStart = new Date(Date.now());
        nowStart.setUTCHours(0);
        nowStart.setUTCMinutes(0);
        nowStart.setUTCSeconds(0);
        nowStart.setUTCMilliseconds(0o0);

        const nowEnd = new Date(Date.now());
        nowEnd.setUTCHours(23);
        nowEnd.setUTCMinutes(59);
        nowEnd.setUTCSeconds(59);
        nowEnd.setUTCMilliseconds(999);

        Payment.aggregate([
            {
                $match: {
                    date: {
                        $gte: start ? new Date(start) : new Date(nowStart),
                        $lte: end ? new Date(todayEnd) : new Date(nowEnd),
                    },
                },
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$user.name",
                    amount: { $sum: "$amount" },
                },
            },
        ]).exec((err, results) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({
                size: results.length,
                results,
            });
        });
    }
}

module.exports = PaymentService;
