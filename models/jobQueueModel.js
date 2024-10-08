const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobQueueSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["ENQUIRY_EXPORT"],
    },
    status: {
      type: String,
      required: true,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"],
    },
    isExpired: {
      type: Boolean,
      required: true,
      default: false,
    },
    metadata: {},
  },
  { timestamps: true }
);

const jobQueueModel = mongoose.model("jobQueues", jobQueueSchema);

module.exports = {
  jobQueueModel,
};
