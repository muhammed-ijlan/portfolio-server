const mongoose = require("mongoose");
const moment = require("moment");
const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const {
    authService,
    jwtService
} = require("../services/_index");



////////////////////////////////// Admin /////////////////////////////////

exports.registerSuperAdmin = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        let reqBody = req.body;
        reqBody['accType'] = 'ADMIN';
        await authService.createAdmin(reqBody);
        let response = new ResponseBody("Admin Successfully Registered", false, {});
        responseHandler(res, next, response, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};

exports.loginMember = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        let reqBody = req.body;
        let filters = { email: reqBody.email, isBlocked: false };
        const member = await authService.findAdminWithFilters(filters, "", {});
        if (!member) {
            let response = new ResponseBody("Invalid Account", true, {});
            res.status(200);
            res.setHeader("Content-Type", "application/json");
            return res.json(response);
        }
        if (!(await member.verifyHash(reqBody.password))) {
            res.status(200);
            res.setHeader("Content-Type", "application/json");
            return res.json(new ResponseBody("invalid Password", true, {}));
        }
        let token = await jwtService.createAdminToken(member._id);
        member.token = token;
        await member.save();
        const responsePayload = await authService.loginMember(member);
        let response = new ResponseBody("Login success", false, responsePayload);
        responseHandler(res, next, response, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};

exports.logOutMember = async (req, res, next) => {
    try {
        let member = req.member;
        await authService.logoutMember(member._id);
        let response = new ResponseBody("Logout successful", false, {});
        responseHandler(res, next, response, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};

