const { jobQueueModel } = require("../models/_index");
const moment = require("moment");

exports.getExportEnquiryJobs = async (options) => {
  let pipeline = [];
  pipeline.push(
    { $match: { name: "ENQUIRY_EXPORT" } },
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
        data: [{ $skip: options.page * options.size }, { $limit: options.size }],
      },
    },
    {
      $project: {
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
        "data.name": 1,
        "data.status": 1,
        "data._id": 1,
        "data.isExpired": 1,
        "data.updatedAt": 1,
      },
    }
  );
  return await jobQueueModel.aggregate(pipeline);
};

exports.getExportEnquiryByDate = async () => {
  const date = moment().subtract(1, "week");
  return await jobQueueModel.find({ updatedAt: { $lt: date }, name: "ENQUIRY_EXPORT" });
};

exports.getEnquiryExportPath = async (id) => {
  console.log(id);
  return await jobQueueModel
    .findOne({ _id: id, status: "COMPLETED", isExpired: false }, "metadata")
    .lean();
};

exports.removePath = async (ids) => {
  return await jobQueueModel.updateMany(
    { _id: { $in: ids } },
    { "metadata.filePath": null, isExpired: true }
  );
};

exports.createJob = async (reqBody = {}) => {
  return await jobQueueModel.create(reqBody);
};
