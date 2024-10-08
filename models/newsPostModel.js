const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsPostSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "news_categories",
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    shortDescription: {
      type: String,
    },
    readingTime: {
      type: Number,
      required: true,
    },
    images: {
      type: [],
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
    },
    metaTags: {
      type: [String],
    },
    metaDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

const newsPostModel = mongoose.model("news_posts", newsPostSchema);

module.exports = {
  newsPostModel,
};
