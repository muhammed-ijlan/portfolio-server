const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enquirySourceSchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
        requried: true
    },
    isBlocked: {
        type: Boolean,
        default: false,
        requried: true
    }
}, { timestamps: true })

const enquirySourceModel = mongoose.model("enquirySource", enquirySourceSchema);

module.exports = {
    enquirySourceModel
}