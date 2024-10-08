const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogCategorySchema = new Schema({
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

const blogCategoryModel = mongoose.model("blog_categories", blogCategorySchema);

module.exports = {
  blogCategoryModel,
};
