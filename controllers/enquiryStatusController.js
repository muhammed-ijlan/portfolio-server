const { validationResult } = require("express-validator");
const { enquiryStatusService } = require("../services/_index");
const { ResponseBody, ErrorBody, responseHandler } = require("../utils/_index");

exports.createEnquiryStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid data", errors.array());
        }
        const reqBody = req.body;
        await enquiryStatusService.createEnquiryStatus(reqBody);
        const responeBody = new ResponseBody("Enquiry Status has been created", false, {})
        responseHandler(res, next, responeBody)
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};

exports.getAllEnquiryStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Invalid data", errors.array());
        }
        let { page, size } = req.query;
        page = page ? parseInt(page) : 0;
        size = size ? parseInt(size) : 10;
        const options = {
            page,
            size,
        };
        const enquiryStatus = await enquiryStatusService.getAllEnquiryStatus(options);

        const responsePayload = {
            maxRecords: 0,
            data: []
        };

        if (enquiryStatus) {
            responsePayload.maxRecords = enquiryStatus[0].maxRecords || 0;
            responsePayload.data = enquiryStatus[0].data || [];
        };

        const responeBody = new ResponseBody("Enquiry Status has been fetched", false, responsePayload)
        responseHandler(res, next, responeBody)
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
}