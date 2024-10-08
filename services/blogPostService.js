const { blogPostModel } = require("../models/_index");

exports.createBlogPost = async (data) => {
  return await blogPostModel.create(data);
};

exports.getBlogPostsWithFilters = async (options) => {
  let pipeline = [];
  if (options.title) {
    pipeline.push({
      $match: {
        title: { $regex: options.title, $options: "i" },
      },
    });
  }
  if (options.blogId) {
    pipeline.push({
      $match: {
        _id: options.blogId,
      },
    });
  }
  if (options.category) {
    pipeline.push({
      $match: {
        category: options.category,
      },
    });
  }
  if (options.readingTime) {
    pipeline.push({
      $match: {
        readingTime: options.readingTime,
      },
    });
  }
  if (options.startDate) {
    pipeline.push({
      $match: {
        createdAt: { $gte: options.startDate },
      },
    });
  }
  if (options.endDate) {
    pipeline.push({
      $match: {
        createdAt: { $lte: options.endDate },
      },
    });
  }
  if ([true, false].includes(options.isBlocked)) {
    pipeline.push({
      $match: {
        isBlocked: options.isBlocked,
      },
    });
  }
  pipeline.push(
    {
      $sort: { _id: -1 },
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],
        data: [
          { $skip: options.page * options.size },
          { $limit: options.size },
          {
            $lookup: {
              from: "blog_categories",
              let: { category: "$category" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$category", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                  },
                },
              ],
              as: "category",
            },
          },
          {
            $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              title: 1,
              shortDescription: 1,
              readingTime: 1,
              images: 1,
              createdAt: 1,
              category: "$category.name",
              isBlocked: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
        data: 1,
      },
    }
  );
  return blogPostModel.aggregate(pipeline);
};

exports.getOneBlogPost = async (filter) => {
  return await blogPostModel.findOne(filter);
};

exports.findBlogById = async (id, projections = null, options = {}) => {
  return await blogPostModel.findById(id, projections, options);
};

exports.deleteBlogPost = async (blogId) => {
  return await blogPostModel.findByIdAndDelete(blogId);
};

exports.updateStatus = async (category, status) => {
  return await blogPostModel.updateMany({ category: category }, { isBlocked: status });
};

exports.updateStatusByID = async (id, status) => {
  console.log(id, status);
  return await blogPostModel.findByIdAndUpdate(id, { isBlocked: status });
};

////////////////////////////////////// user services ///////////////////////////////////////

exports.userGetBlogPostsWithFilters = async (options) => {
  let pipeline = [];
  if (options.title) {
    pipeline.push({
      $match: {
        title: { $regex: options.title, $options: "i" },
      },
    });
  }
  if (options.category) {
    pipeline.push({
      $match: {
        category: options.category,
      },
    });
  }
  pipeline.push(
    {
      $match: { isBlocked: false },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],
        data: [
          { $skip: options.page * options.size },
          { $limit: options.size },
          {
            $lookup: {
              from: "blog_categories",
              let: { category: "$category" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$category", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                  },
                },
              ],
              as: "category",
            },
          },
          {
            $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              title: 1,
              shortDescription: 1,
              readingTime: 1,
              images: 1,
              createdAt: 1,
              category: "$category.name",
              isBlocked: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
        data: 1,
      },
    }
  );
  return blogPostModel.aggregate(pipeline);
};

exports.userGetLatestBlogs = async (options) => {
  let pipeline = [];
  pipeline.push(
    {
      $match: { isBlocked: false },
    },
    {
      $sort: { createdAt: -1 },
    },
    { $limit: 100 },
    { $sample: { size: options.size } },
    {
      $lookup: {
        from: "blog_categories",
        let: { category: "$category" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$category", "$_id"],
              },
            },
          },
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "category",
      },
    },
    {
      $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        title: 1,
        shortDescription: 1,
        readingTime: 1,
        images: 1,
        createdAt: 1,
        category: "$category.name",
        isBlocked: 1,
      },
    }
  );
  return blogPostModel.aggregate(pipeline);
};

exports.userGetLatestBlogsWithoutDescription = async (options) => {
  let pipeline = [];
  pipeline.push(
    {
      $match: { isBlocked: false },
    },
    {
      $sort: { createdAt: -1 },
    },
    { $limit: 100 },
    { $sample: { size: options.size } },
    {
      $lookup: {
        from: "blog_categories",
        let: { category: "$category" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$$category", "$_id"],
              },
            },
          },
          {
            $project: {
              name: 1,
            },
          },
        ],
        as: "category",
      },
    },
    {
      $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        title: 1,
        readingTime: 1,
        images: 1,
        createdAt: 1,
        category: "$category.name",
        isBlocked: 1,
      },
    }
  );
  return blogPostModel.aggregate(pipeline);
};

exports.userGetOtherBlogPostsFromCategories = async (options) => {
  let pipeline = [];
  pipeline.push(
    {
      $match: { isBlocked: false, category: options.categoryId, _id: { $nin: [options.blogId] } },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],
        data: [
          { $skip: options.page * options.size },
          { $limit: options.size },
          {
            $lookup: {
              from: "blog_categories",
              let: { category: "$category" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$category", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                  },
                },
              ],
              as: "category",
            },
          },
          {
            $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              title: 1,
              shortDescription: 1,
              readingTime: 1,
              images: 1,
              createdAt: 1,
              category: "$category.name",
              isBlocked: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
        data: 1,
      },
    }
  );
  return blogPostModel.aggregate(pipeline);
};

exports.userGetBlogPostsFromCategories = async (options) => {
  let pipeline = [];
  pipeline.push(
    {
      $match: { isBlocked: false, category: options.categoryId },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],
        data: [
          { $skip: options.page * options.size },
          { $limit: options.size },
          {
            $lookup: {
              from: "blog_categories",
              let: { category: "$category" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$$category", "$_id"],
                    },
                  },
                },
                {
                  $project: {
                    name: 1,
                  },
                },
              ],
              as: "category",
            },
          },
          {
            $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              title: 1,
              shortDescription: 1,
              readingTime: 1,
              images: 1,
              createdAt: 1,
              category: "$category.name",
              isBlocked: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
        data: 1,
      },
    }
  );
  return blogPostModel.aggregate(pipeline);
};
