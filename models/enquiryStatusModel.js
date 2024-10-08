const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enquiryStatusSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        index: true,
        required: true
    },
    priority: {
        type: Number,
        default: 0,
        index: true
    }
}, { timestamps: true })

const enquiryStatusModel = mongoose.model('enquiryStatus', enquiryStatusSchema);

module.exports = {
    enquiryStatusModel
}