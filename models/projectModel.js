const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        projectName: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        projectLink: {
            type: String,
            required: true,
            trim: true
        },
        isPopular: {
            type: Boolean,
            required: true,
            default: false
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false
        },
        images: {
            type: [],
        },
    },
    {
        timestamps: true
    }
);




const projectModel = mongoose.model("project", projectSchema);

module.exports = {
    projectModel,
};