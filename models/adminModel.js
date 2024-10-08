const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");


const adminSchema = new Schema(
    {
        fullname: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        hash: {
            type: String,
            required: true
        },
        accType: {
            type: String,
            required: true,
            default: "ADMIN",
            index: true,
        },
        isBlocked: {
            type: Boolean,
            required: true,
            default: false
        },
        profilePic: {
            type: String,
        },
        token: {
            type: String
        },
    },
    {
        timestamps: true
    }
);


adminSchema.methods.setHash = async function (password) {
    try {
        this.hash = await argon2.hash(password);
    } catch (error) {
        return Promise.reject(error);
    }
};

adminSchema.methods.verifyHash = async function (password) {
    try {
        return await argon2.verify(this.hash, password);
    } catch (error) {
        return Promise.reject(error);
    }
};

const adminModel = mongoose.model("admin", adminSchema);

module.exports = {
    adminModel,
};