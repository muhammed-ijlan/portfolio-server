const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    uppercase: true,
    index: true,
    unique: true,
    trim: true,
  },
  isBlocked: {
    type: Boolean,
    required: true,
    default: false,
    index: true,
  },
});

const newsCategoryModel = mongoose.model("news_categories", newsCategorySchema);

module.exports = {
  newsCategoryModel,
};
