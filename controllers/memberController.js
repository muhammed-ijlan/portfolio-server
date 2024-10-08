const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const moment = require("moment");
const { memberService, authService } = require("../services/_index");
const path = require("path");
const fs = require("fs");



exports.addEmployee = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    if (await memberService.findMemberWithFilters({ email: reqBody.email }, "_id", { lean: true })) {
      const responseBody = new ResponseBody("Email already Exists", true, {});
      return responseHandler(res, next, responseBody, 200);
    }
    await memberService.addMember(reqBody);
    const responseBody = new ResponseBody("Employee Successfully added", false, {});
    responseHandler(res, next, responseBody, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.addSubAdmin = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    if (await memberService.findMemberWithFilters({ email: reqBody.email }, "_id", { lean: true })) {
      const responseBody = new ResponseBody("Email already Exists", true, {});
      return responseHandler(res, next, responseBody, 200);
    }
    reqBody['accType'] = 'SUB_ADMIN';
    await memberService.addMember(reqBody);
    const responseBody = new ResponseBody("Sub-Admin Successfully added", false, {});
    responseHandler(res, next, responseBody, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getMember = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { _id, accType } = req.authAccount;
    let { id } = req.query;
    let filters = {
      _id: mongoose.Types.ObjectId(id)
    };
    if (accType == "TELE_CALLER" || accType == "ENQUIRY_MANAGER") {
      filters._id = _id;
    }
    const member = await memberService.findMemberWithFilters(filters, "_id fullname email accType role isBlocked profilePic accessList createdAt updatedAt", { lean: true });
    if (!member) {
      const responseBody = new ResponseBody("Account doesn't exists", true, {});
      return responseHandler(res, next, responseBody, 200);
    }
    const responseBody = new ResponseBody("member Successfully retrieved", false, { ...member });
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.memberStatusChange = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { isBlocked, id } = req.body;
    const member = await memberService.updateMemberWithFilters({ _id: mongoose.Types.ObjectId(id) }, { isBlocked: isBlocked }, { new: true });
    if (member.isBlocked) {
      await authService.logoutMember(id);
    }
    const responseBody = new ResponseBody("Status successfully updated", false, {});
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { page, size, fullname, isBlocked, id, role, email } = req.query;
    page = page ? parseInt(page) : 0;
    size = size ? parseInt(size) : 10;
    id = id ? mongoose.Types.ObjectId(id) : null;
    fullname = fullname ? fullname.replace(/\s+/g, " ").split(" ").join(".*") : null;
    isBlocked = isBlocked === "true" ? true : (isBlocked === "false" ? false : null);
    let options = { page, size, fullname, isBlocked, id, role, email };
    const result = await memberService.getEmployees(options);
    let responsePayload = {
      maxRecords: 0,
      records: []
    };
    if (result.length) {
      responsePayload.maxRecords = result[0].maxRecords || 0;
      responsePayload.records = result[0].data || [];
    }
    const responseBody = new ResponseBody("Employees retrieved successfully", false, responsePayload);
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};


exports.getSubadmins = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { page, size } = req.query;
    page = page ? parseInt(page) : 0;
    size = size ? parseInt(size) : 10;
    let options = { page, size };
    const result = await memberService.getSubAdmins(options);
    let responsePayload = {
      maxRecords: 0,
      records: []
    };
    if (result.length) {
      responsePayload.maxRecords = result[0].maxRecords || 0;
      responsePayload.records = result[0].data || [];
    }
    const responseBody = new ResponseBody("Admins retrieved successfully", false, responsePayload);
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { id, fullname, email, password } = req.body;
    const employee = await memberService.findMemberWithFilters({ _id: id, accType: "ENQUIRY_MANAGER" || "TELE_CALLER" }, "", {});
    if (!employee) {
      const responseBody = new ResponseBody("Employee doesnt Exists", true, {});
      return responseHandler(res, next, responseBody, 200);
    }
    if (fullname) {
      employee.fullname = fullname;
    }
    if (email) {
      if (employee.email != email) {
        if (await memberService.findMemberWithFilters({ email: email }, "_id", {})) {
          const responseBody = new ResponseBody("Email already Exists", true, {});
          return responseHandler(res, next, responseBody, 200);
        }
        employee.email = email;
      }
    }
    if (password) {
      await employee.setHash(password);
    }
    let currentProfilePic = employee.profilePic;
    if (req.file) {
      employee.profilePic = "/memberProfileImages/" + req.file.filename;
    }
    if (req.file && currentProfilePic) {
      const fileName = currentProfilePic.substring(currentProfilePic.lastIndexOf('/') + 1);
      const fullPath = path.join(__dirname, `../public/memberProfileImages/${fileName}`);
      try {
        await fs.promises.unlink(fullPath);

      } catch (err) {
        console.log(err);
      }
    }
    await employee.save();
    const responseBody = new ResponseBody("Employee Successfully updated", false, {});
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};


exports.updateSubadmin = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { id, fullname, email, password } = req.body;
    const subAdmin = await memberService.findMemberWithFilters({ _id: id, accType: "SUB_ADMIN" }, "", {});
    if (!subAdmin) {
      const responseBody = new ResponseBody("Sub-Admin doesnt Exists", true, {});
      return responseHandler(res, next, responseBody, 200);
    }
    if (fullname) {
      subAdmin.fullname = fullname;
    }
    if (email) {
      if (subAdmin.email != email) {
        if (await memberService.findMemberWithFilters({ email: email }, "_id", {})) {
          const responseBody = new ResponseBody("Email already Exists", true, {});
          return responseHandler(res, next, responseBody, 200);
        }
        subAdmin.email = email;
      }
    }
    if (password) {
      await subAdmin.setHash(password);
    }
    let currentProfilePic = subAdmin.profilePic;
    if (req.file) {
      subAdmin.profilePic = "/memberProfileImages/" + req.file.filename;
    }
    if (req.file && currentProfilePic) {
      const fileName = currentProfilePic.substring(currentProfilePic.lastIndexOf('/') + 1);
      const fullPath = path.join(__dirname, `../public/memberProfileImages/${fileName}`);
      try {
        await fs.promises.unlink(fullPath);

      } catch (err) {
        console.log(err);
      }
    }
    await subAdmin.save();
    const responseBody = new ResponseBody("Sub-Admin Successfully updated", false, {});
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.updateMemberProfile = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { fullname, email, password } = req.body;
    const { _id, accType } = req.authAccount;
    const member = await memberService.findMemberWithFilters({ _id: _id }, "", {});
    if (!member) {
      const responseBody = new ResponseBody("member doesnt Exists", true, {});
      return responseHandler(res, next, responseBody, 200);
    }
    if (fullname && accType !== "ENQUIRY_MANAGER" || accType !== "TELE_CALLER") {
      member.fullname = fullname;
    }
    if (email && accType !== "ENQUIRY_MANAGER" || accType !== "TELE_CALLER") {
      if (member.email != email) {
        if (await memberService.findMemberWithFilters({ email: email }, "_id", {})) {
          const responseBody = new ResponseBody("Email already Exists", true, {});
          return responseHandler(res, next, responseBody, 200);
        }
        member.email = email;
      }
    }
    if (password) {
      await member.setHash(password);
    }
    let currentProfilePic = member.profilePic;
    if (req.file) {
      member.profilePic = "/memberProfileImages/" + req.file.filename;
    }
    if (req.file && currentProfilePic) {
      const fileName = currentProfilePic.substring(currentProfilePic.lastIndexOf('/') + 1);
      const fullPath = path.join(__dirname, `../public/memberProfileImages/${fileName}`);
      try {
        await fs.promises.unlink(fullPath);

      } catch (err) {
        console.log(err);
      }
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


exports.updateMember = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { password } = req.body;
    let { _id } = req.authAccount;
    const member = await memberService.findMemberWithFilters({ _id: _id }, "", {});
    if (!member) {
      throw new ErrorBody();
    }
    await member.setHash(password);
    await member.save();
    const responseBody = new ResponseBody("Profile Successfully updated", false, {});
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};