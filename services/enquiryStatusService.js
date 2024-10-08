const { enquiryStatusModal } = require("../models/_index")

exports.createEnquiryStatus = async (body) => {
    return await enquiryStatusModal.create(body)
}

exports.getAllEnquiryStatus = async (options) => {
    const pipeline = [];
    pipeline.push(
        {
            $sort: { priority: -1, name: 1 }
        },
        {
            $facet: {
                metadata: [
                    {
                        $group: {
                            _id: null,
                            maxRecords: { $sum: 1 }
                        }
                    }
                ],
                data: [
                    { $skip: options.page * options.size },
                    { $limit: options.size },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            createdAt: 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                data: 1,
                maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0], }, 0] }
            }
        }
    )
    return await enquiryStatusModal.aggregate(pipeline);
}