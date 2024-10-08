const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const { jobQueueService, jwtService } = require("../services/_index");
const mongoose = require("mongoose");

exports.getAllEnquiryExportJobs = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let page = reqQuery.page ? Number(reqQuery.page) : 0;
    let size = reqQuery.size ? Number(reqQuery.size) : 5;
    let options = { size, page };
    let result = await jobQueueService.getExportEnquiryJobs(options);
    let response = new ResponseBody("Successfully retrieved all enquiry export Jobs", false, {
      data: result.length ? result[0].data : [],
      maxRecords: result.length ? result[0].maxRecords : 0,
    });
    responseHandler(res, next, response, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getEnquiryExportDownloadLink = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let id = req.query.id;
    let result = await jobQueueService.getEnquiryExportPath(id);
    if (!result) {
      throw new ErrorBody(400, "Bad Input", []);
    }
    let token = await jwtService.createFileDownloadToken(result.metadata.filePath);
    let response = new ResponseBody("Download link retrieved", false, {
      url: `${process.env.SERVER_URL}/download/admin/enquiry?token=${token}`,
    });
    responseHandler(res, next, response, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};
