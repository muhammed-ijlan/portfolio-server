const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configurationSchema = new Schema({
  designations: [
    {
      type: String,
      uppercase: true,
      trim: true,
    },
  ],
  certificates: [
    {
      type: String,
      trim: true,
      uppercase: true,
    },
  ],
});

const configurationModel = mongoose.model("configurations", configurationSchema);

module.exports = {
  configurationModel,
};
