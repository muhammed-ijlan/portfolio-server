const { newsCategoryModel } = require("../models/_index");

////////////////////////////////////// Admin Services ////////////////////////////////////////

exports.createNewCategory = async (data) => {
  return await newsCategoryModel.create(data);
};

exports.getCategories = async (options) => {
  let pipeline = [];
  if (options.id) {
    pipeline.push({
      $match: {
        _id: options.id,
      },
    });
  }
  if (options.name) {
    pipeline.push({
      $match: {
        name: { $regex: options.name, $options: "i" },
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
      $sort: { name: 1 },
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
  return newsCategoryModel.aggregate(pipeline);
};

exports.updateStatus = async (id, status) => {
  return await newsCategoryModel.findByIdAndUpdate(id, {
    isBlocked: status,
  });
};

exports.getOneCategory = async (id) => {
  return await newsCategoryModel.findById(id);
};

//////////////////////////////////////// user services //////////////////////////////
exports.userGetCategories = async (options) => {
  let pipeline = [];
  pipeline.push(
    {
      $match: {
        isBlocked: false,
      },
    },
    {
      $sort: { name: 1 },
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
  return newsCategoryModel.aggregate(pipeline);
};
