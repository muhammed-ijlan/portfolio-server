const { jwtService, authService } = require("../services/_index");
const mongoose = require("mongoose");
const { ErrorBody } = require("../utils/ErrorBody");
const path = require("path");
const { validationResult } = require("express-validator");

exports.verify = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let token = req.query.token;
    let decoded = await jwtService.verifyFileDownloadToken(token);
    if (!decoded || !decoded.filename) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    let filename = decoded.filename;
    return res.download(filename);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : new ErrorBody(400, "Link Expired", []));
  }
};
