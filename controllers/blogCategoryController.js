const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler, emailTemplates } = require("../utils/_index");
const { blogCategoryService, blogPostService } = require("../services/_index");
const mongoose = require("mongoose");

////////////////////////////////////////////// Admin controllers /////////////////////////////////////////////////////////

exports.addCategory = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    await blogCategoryService.createNewCategory(reqBody);
    const response = new ResponseBody("Successfully added Category", false, {});
    responseHandler(res, next, response, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    const reqQuery = req.query;
    let id = reqQuery.id ? mongoose.Types.ObjectId(reqQuery.id) : null;
    let name = reqQuery.name ? reqQuery.name.replace(/\s+/g, " ").split(" ").join(".*") : "";
    let page = parseInt(reqQuery.page);
    let size = parseInt(reqQuery.size);
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let isBlocked = reqQuery.isBlocked || null;
    if (isBlocked && isBlocked === "true") {
      isBlocked = true;
    } else if (isBlocked && isBlocked === "false") {
      isBlocked = false;
    }
    let options = { page, size, id, name, isBlocked };
    const categories = await blogCategoryService.getCategories(options);
    const response = new ResponseBody("Successfully retrieved Category", false, {
      maxRecords: categories.length ? categories[0].maxRecords : 0,
      categories: categories.length ? categories[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getActiveCategories = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let page = 0;
    let size = 50;
    let isBlocked = false;
    let options = { page, size, isBlocked };
    const categories = await blogCategoryService.getCategories(options);
    const response = new ResponseBody("Successfully retrieved Category", false, {
      categories: categories.length ? categories[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.changeStatus = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let id = req.body.id;
    let blockedStatus = req.body.status;
    await blogCategoryService.updateStatus(id, blockedStatus);
    await blogPostService.updateStatus(id, blockedStatus);
    const response = new ResponseBody("Successfully changed status", false, {});
    responseHandler(res, next, response, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.editCategoty = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    let id = req.body.id;
    const category = await blogCategoryService.getOneCategory(id);
    if (reqBody.name) {
      category.name = reqBody.name;
    }
    await category.save();
    const response = new ResponseBody("Successfully updated category", false, {});
    responseHandler(res, next, response, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetCategories = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    const reqQuery = req.query;
    let page = parseInt(reqQuery.page);
    let size = parseInt(reqQuery.size);
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let options = { page, size };
    const categories = await blogCategoryService.userGetCategories(options);
    const response = new ResponseBody("Successfully retrieved Category", false, {
      maxRecords: categories.length ? categories[0].maxRecords : 0,
      categories: categories.length ? categories[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};