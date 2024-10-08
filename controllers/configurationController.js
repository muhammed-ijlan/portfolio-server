const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler, emailTemplates } = require("../utils/_index");
const { configurationService } = require("../services/_index");
const mongoose = require("mongoose");
const moment = require("moment");

exports.addNewDesignation = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    let update = {
      $addToSet: {
        designations: reqBody.designation,
      },
    };
    await configurationService.updateConfiguration(update);
    let response = new ResponseBody("Designation Successfully Added", false, {});
    responseHandler(res, next, response, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.addNewCertificate = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    let update = {
      $addToSet: {
        certificates: reqBody.certificate,
      },
    };
    await configurationService.updateConfiguration(update);
    let response = new ResponseBody("Certificate Successfully Added", false, {});
    responseHandler(res, next, response, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getAllDesignations = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    const designations = await configurationService.getConfigurations({ designations: 1 });
    let response = new ResponseBody("Designations successfully retrived", false, {
      designations: designations.designations,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getAllCertificates = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    const certificates = await configurationService.getConfigurations({ certificates: 1 });
    let response = new ResponseBody("Certificates successfully retrived", false, {
      certificates: certificates.certificates,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};
