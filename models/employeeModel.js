const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const argon2 = require("argon2");

const fileSchema = new Schema(
  {
    fileURL: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
  },
  { _id: true, timestamps: true }
);

const certificateSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  files: [fileSchema],
});

const employeeSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    accType: {
      type: String,
      required: true,
      default: "ADMIN",
      index: true,
    },
    // designation: {
    //   type: String,
    //   required: true,
    //   uppercase: true,
    // },
    hash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    contactAddress: {
      type: String,
      trim: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
      required: true,
    },
    joiningDate: {
      type: Date,
    },
    resignDate: {
      type: Date,
    },
    token: {
      type: String,
      index: true,
    },
    profilePic: {
      type: String,
    },
    certificates: [certificateSchema],
  },
  { timestamps: true }
);

employeeSchema.methods.setHash = async function (password) {
  try {
    this.hash = await argon2.hash(password);
  } catch (error) {
    return Promise.reject(error);
  }
};

employeeSchema.methods.verifyHash = async function (password) {
  try {
    return await argon2.verify(this.hash, password);
  } catch (error) {
    return Promise.reject(error);
  }
};

const employeeModel = mongoose.model("employees", employeeSchema);

module.exports = { employeeModel };
