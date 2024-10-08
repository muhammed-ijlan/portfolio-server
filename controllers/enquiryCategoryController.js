const { validationResult } = require('express-validator');
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const { enquiryCategoryService } = require('../services/_index');
const { default: mongoose } = require('mongoose');


exports.createEnquiryCategory = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid data", errors.array())
        }
        let responseBody;
        const { name, isBlocked } = req.body;
        const existing = await enquiryCategoryService.getCategoryWithFilters({ name: name })
        if (existing) {
            responseBody = new ResponseBody("Enquiry Data already existed", true, {})
            return responseHandler(res, next, responseBody, 400)
        }
        const enquiryCategory = await enquiryCategoryService.createEnquiryCategory({ name: name, isBlocked: isBlocked })
        responseBody = new ResponseBody("Enquiry Data created successfully", true, enquiryCategory);
        return responseHandler(res, next, responseBody, 201);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}

exports.getAllEnquiryCategories = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid inputs", errors.array())
        }
        let responseBody;

        let responsePayload = {
            maxRecords: 0,
            records: []
        }
        let { page, size } = req.query;
        page = page ? parseInt(page) : 0;
        size = size ? parseInt(size) : 10;
        const options = {
            page,
            size,
        }
        const result = await enquiryCategoryService.getAllEnquiryCategoriesWithFilters(options)
        if (result.length > 0) {
            responsePayload.maxRecords = result[0].maxRecords || 0;
            responsePayload.records = result[0].data || [];
        }
        responseBody = new ResponseBody("Enquiry Data fetched successfully", false, responsePayload);
        return responseHandler(res, next, responseBody, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}

exports.updateEnquiryCategory = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid inputs", errors.array())
        }
        let responseBody;
        const { name, id, isBlocked } = req.body;
        const record = await enquiryCategoryService.getCategoryWithFilters({ name: name })
        if (record && !record._id.equals(mongoose.Types.ObjectId(id))) {
            responseBody = new ResponseBody("Enquiry Data not found", true, {})
            return responseHandler(res, next, responseBody, 400)
        }
        const enquiryCategory = await enquiryCategoryService.updateEnquiryCategoryWithFilters({ _id: id }, { name: name, isBlocked: isBlocked })
        responseBody = new ResponseBody("Enquiry Data updated successfully", false, enquiryCategory);
        return responseHandler(res, next, responseBody, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}