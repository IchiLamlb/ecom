const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    user: {
        type: Array,
        default: [],
    },
    data: {
        type: Array,
        default: [],
    },
    product: {
        type: Array,
        default: [],
    },
    paymentMethod: {
        type: String,
    },
    status: {
        type: String,
        maxlength: 100,
        default: "Pending",
    },
    arrivaltime: {
        type: String,
        default: "not update",
    },
    date: { type: Date, default: new Date() },
    amount: {
        type: Number,
        required: true,
    },
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = { Payment };
