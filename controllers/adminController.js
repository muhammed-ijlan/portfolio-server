const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const moment = require("moment");
const { adminService, authService } = require("../services/_index");
const path = require("path");
const fs = require("fs");



exports.getMember = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }

    const { _id } = req.admin;
    const filters = { _id: mongoose.Types.ObjectId(_id) };

    const member = await adminService.findMemberWithFilters(
      filters,
      "_id fullname email accType role isBlocked profilePic accessList createdAt updatedAt",
      { lean: true }
    );

    if (!member) {
      const responseBody = new ResponseBody("Account doesn't exist", true, {});
      return responseHandler(res, next, responseBody, 200);
    }

    const responseBody = new ResponseBody("Member successfully retrieved", false, member);
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.error(error);
    next([400, 401, 403].includes(error.status) ? error : new ErrorBody(500, "Server error", []));
  }
};



exports.updateMemberProfile = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { fullname, email, password } = req.body;
    console.log(req.body)
    const { _id } = req.admin;
    const member = await adminService.findMemberWithFilters({ _id: _id }, "", {});
    if (!member) {
      const responseBody = new ResponseBody("member doesnt Exists", true, {});
      return responseHandler(res, next, responseBody, 200);
    }
    if (fullname) {
      member.fullname = fullname;
    }
    if (email) {
      if (member.email != email) {
        if (await adminService.findMemberWithFilters({ email: email }, "_id", {})) {
          const responseBody = new ResponseBody("Email already Exists", true, {});
          return responseHandler(res, next, responseBody, 200);
        }
        member.email = email;
      }
    }
    if (password) {
      await member.setHash(password);
    }

    await member.save();
    member.hash = undefined;
    const responseBody = new ResponseBody("member Successfully updated", false, member);
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};
