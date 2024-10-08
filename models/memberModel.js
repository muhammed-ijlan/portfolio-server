const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");


const accessListSchema = new Schema(
    {

    },
    {
        _id: false
    }
);


const memberSchema = new Schema(
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
            enum: ["SUPER_ADMIN", "SUB_ADMIN", "TELE_CALLER", "ENQUIRY_MANAGER"],
            default: "SUB_ADMIN",
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
        accessList: accessListSchema
    },
    {
        timestamps: true
    }
);


memberSchema.methods.setHash = async function (password) {
    try {
        this.hash = await argon2.hash(password);
    } catch (error) {
        return Promise.reject(error);
    }
};

memberSchema.methods.verifyHash = async function (password) {
    try {
        return await argon2.verify(this.hash, password);
    } catch (error) {
        return Promise.reject(error);
    }
};

const memberModel = mongoose.model("members", memberSchema);

module.exports = {
    memberModel,
};