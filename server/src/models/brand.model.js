const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: 1,
        maxlength: 100,
    },
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = { Brand };
