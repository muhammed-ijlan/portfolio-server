const { enquirySourceModal, enquiryModel } = require("../models/_index")

exports.createEnquirySource = async (body = {}) => {
    return await enquirySourceModal.create(body);
};

exports.getEnquirySourceWithFilters = async (filters = {}, projections = null, options = {}) => {
    return await enquirySourceModal.findOne(filters, projections, options);
}

exports.updateEnquirySource = async (filters = {}, updates = {}, options = {}) => {
    return await enquirySourceModal.findOneAndUpdate(filters, updates);
};

exports.getAllEnquirySources = async (options = {}) => {
    const pipeline = [];
    pipeline.push(
        {
            $sort: {
                name: 1,
            }
        },
        {
            $facet: {
                metadata: [
                    {
                        $group: {
                            _id: null,
                            total: { $sum: 1 }
                        }
                    }
                ],
                data: [
                    { $skip: options.page * options.size },
                    { $limit: options.size },
                    {
                        $project: {
                            id: 1,
                            name: 1,
                            isBlocked: 1,
                            createdAt: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                data: 1,
                maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] }
            }
        }
    );
    return await enquirySourceModal.aggregate(pipeline);
}