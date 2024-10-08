const { enquiryCategoryModel } = require("../models/_index")

exports.getCategoryWithFilters = async (filters = {}, projection = null, options = {}) => {
    return await enquiryCategoryModel.findOne(filters, projection, options)
};

exports.createEnquiryCategory = async (data) => {
    return await enquiryCategoryModel.create(data)
};

exports.getAllEnquiryCategoriesWithFilters = async (options = {}) => {
    const pipeline = [];
    pipeline.push(
        {
            $sort: { name: 1 }
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
                            name: 1,
                            isBlocked: 1,
                            createdAt: 1,
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
    )
    return await enquiryCategoryModel.aggregate(pipeline)
};

exports.updateEnquiryCategoryWithFilters = async (filters = {}, data = {}) => {
    return await enquiryCategoryModel.findOneAndUpdate(filters, data, { new: true })
}