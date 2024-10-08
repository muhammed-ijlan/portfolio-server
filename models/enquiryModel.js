const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    enum: [
      "ISO_Management_System",
      "HSE",
      "Human_Resources",
      "Financial",
      "Business_Excellence",
      "Sustainability",
      "Product_Certification",
      "Inspection_Services",
    ],
  },
  serviceType: {
    type: [String],
    required: true,
    enum: ["CONSULTANCY", "TRAINING", "API", "CONSULTANCY_AND_ADVISORY", "INSPECTION"],
  },
});

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
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    organisation: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    // source: {
    //   type: Schema.Types.ObjectId,
    //   ref: "enquirySource",
    //   required: true,
    //   index: true
    // },
    // teleCaller: {
    //   type: Schema.Types.ObjectId,
    //   ref: "employees",
    //   required: true,
    //   index: true
    // },
    // enquiryManager: {
    //   type: Schema.Types.ObjectId,
    //   ref: "employees",
    //   required: true,
    //   index: true
    // },
    servicesFor: {
      type: String,
      required: true,
      enum: ["SELF", "COMPANY"],
    },
    services: [serviceSchema],
  },
  { timestamps: true }
);

const enquiryModel = mongoose.model("enquiries", enquirySchema);

module.exports = {
  enquiryModel,
};
