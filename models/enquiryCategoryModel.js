const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enquiryCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
        required: true
    }
}, { timestamps: true })

const enquiryCategoryModel = mongoose.model('enquiryCategory', enquiryCategorySchema);

module.exports = {
    enquiryCategoryModel,
}