const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const enquirySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const enquiryModel = mongoose.model("enquiries", enquirySchema);

module.exports = {
  enquiryModel,
};
