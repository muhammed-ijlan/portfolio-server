const { validationResult } = require("express-validator");
const { ErrorBody } = require("../utils/ErrorBody");
const { enquirySourceService } = require("../services/_index");
const { ResponseBody } = require("../utils/ResponseBody");
const responseHandler = require("../utils/responseHandler");
const { default: mongoose } = require("mongoose");

exports.createEnquirySource = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array())
        }
        const reqBody = req.body;
        await enquirySourceService.createEnquirySource(reqBody);
        const responseBody = new ResponseBody("Enquiry Source successfully created", false, {});
        responseHandler(res, next, responseBody, 201);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};

exports.updateEnquirySource = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array())
        }
        const { name, id, isBlocked } = req.body;
        const existing = await enquirySourceService.getEnquirySourceWithFilters({ name: name });
        if (existing && !existing._id.equals(mongoose.Types.ObjectId(id))) {
            throw new ResponseBody(400, "Enquiry Source already exists", false, {});
        }
        await enquirySourceService.updateEnquirySource({ _id: id }, { isBlocked: isBlocked, name: name })
        const responseBody = new ResponseBody("Enquiry Source successfully updated", false, {});
        responseHandler(res, next, responseBody, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};

exports.getAllEnquirySources = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array())
        }
        let { page, size } = req.query;
        page = page ? parseInt(page) : 0;
        size = size ? parseInt(size) : 10;
        let options = { page, size };
        const result = await enquirySourceService.getAllEnquirySources(options);
        let responsePayload = {
            maxRecords: 0,
            records: []
        };
        if (result) {
            responsePayload.maxRecords = result[0].maxRecords || 0;
            responsePayload.records = result[0].data || [];
        }
        const responseBody = new ResponseBody("Enquiry Sources fetched successfully", false, responsePayload);
        responseHandler(res, next, responseBody)
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}