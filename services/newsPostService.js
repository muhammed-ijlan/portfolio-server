const { newsPostModel } = require("../models/_index");

exports.createNewsPost = async (data) => {
  return await newsPostModel.create(data);
};

exports.getNewsPostsWithFilters = async (options) => {
  let pipeline = [];
  if (options.title) {
    pipeline.push({
      $match: {
        title: { $regex: options.title, $options: "i" },
      },
    });
  }
  if (options.newsId) {
    pipeline.push({
      $match: {
        _id: options.newsId,
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
              from: "news_categories",
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
              description: 1,
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
  return newsPostModel.aggregate(pipeline);
};

exports.getOneNewsPost = async (filter) => {
  return await newsPostModel.findOne(filter);
};

exports.findNewsById = async (id, projections = null, options = {}) => {
  return await newsPostModel.findById(id, projections, options);
};

exports.deleteNewsPost = async (newsId) => {
  return await newsPostModel.findByIdAndDelete(newsId);
};

exports.updateStatus = async (category, status) => {
  return await newsPostModel.updateMany({ category: category }, { isBlocked: status });
};

exports.updateStatusByID = async (id, status) => {
  console.log(id, status);
  return await newsPostModel.findByIdAndUpdate(id, { isBlocked: status });
};

////////////////////////////////////// user services ///////////////////////////////////////

exports.userGetNewsPostsWithFilters = async (options) => {
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
              from: "news_categories",
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
  return newsPostModel.aggregate(pipeline);
};

exports.userGetLatestNews = async (options) => {
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
        from: "news_categories",
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
  return newsPostModel.aggregate(pipeline);
};

exports.userGetLatestNewsWithoutDescription = async (options) => {
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
        from: "news_categories",
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
  return newsPostModel.aggregate(pipeline);
};

exports.userGetOtherNewsPostsFromCategories = async (options) => {
  let pipeline = [];
  pipeline.push(
    {
      $match: { isBlocked: false, category: options.categoryId, _id: { $nin: [options.newsId] } },
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
              from: "news_categories",
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
  return newsPostModel.aggregate(pipeline);
};

exports.userGetNewsPostsFromCategories = async (options) => {
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
              from: "news_categories",
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
  return newsPostModel.aggregate(pipeline);
};
