const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const { newsPostService } = require("../services/_index");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

////////////////////////////// Admin Controllers ///////////////////////////

exports.addNewsPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    let files = req.files;
    if (files.length) {
      reqBody["images"] = files.map((item) => {
        return "/newsPostImages/" + item.filename;
      });
    }
    if (reqBody.metaTags) {
      reqBody.metaTags = JSON.parse(reqBody.metaTags);
    }
    await newsPostService.createNewsPost(reqBody);
    const response = new ResponseBody("Successfully added news post", false, {});
    responseHandler(res, next, response, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getAllNewsPosts = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let page = parseInt(reqQuery.page);
    let size = parseInt(reqQuery.size);
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let title = reqQuery.title ? reqQuery.title.replace(/\s+/g, " ").split(" ").join(".*") : "";
    let newsId = reqQuery.newsId ? mongoose.Types.ObjectId(reqQuery.newsId) : null;
    let category = reqQuery.category ? mongoose.Types.ObjectId(reqQuery.category) : null;
    let readingTime = parseInt(reqQuery.readingTime);
    readingTime = isNaN(readingTime) ? null : readingTime;
    let startDate = reqQuery.startDate ? new Date(reqQuery.startDate) : null;
    let endDate = reqQuery.endDate ? new Date(reqQuery.endDate) : null;
    let isBlocked = reqQuery.isBlocked || null;
    if (isBlocked && isBlocked === "true") {
      isBlocked = true;
    } else if (isBlocked && isBlocked === "false") {
      isBlocked = false;
    }
    let options = {
      page,
      size,
      title,
      category,
      readingTime,
      newsId,
      startDate,
      endDate,
      isBlocked,
    };
    let newsPosts = await newsPostService.getNewsPostsWithFilters(options);
    const response = new ResponseBody("Successfully retrieved  newss", false, {
      maxRecords: newsPosts.length ? newsPosts[0].maxRecords : 0,
      newsPosts: newsPosts.length ? newsPosts[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getOneNewsPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let newsId = req.query.newsId;
    let filter = { _id: newsId };
    let newsPost = await newsPostService.getOneNewsPost(filter);
    if (!newsPost) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    const response = new ResponseBody("Successfully retrieved  news", false, {
      newsPost,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.updateNewsPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    let newsId = reqBody.newsId;
    let files = req.files;
    let filter = { _id: newsId };
    let newsPost = await newsPostService.getOneNewsPost(filter);
    if (!newsPost) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    if (files.length) {
      reqBody["images"] = files.map((item) => {
        return "/newsPostImages/" + item.filename;
      });
      const deleteNewsPostImages = async (images) => {
        for (const imagePath of images) {
          const fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
          const fullPath = path.join(__dirname, `../public/newsPostImages/${fileName}`);

          try {
            await fs.promises.unlink(fullPath);
            console.log(`Successfully deleted: ${fullPath}`);
          } catch (error) {
            console.error(`Error deleting file: ${fullPath}\n`, error);
          }
        }
      };
      if (newsPost.images.length) {
        deleteNewsPostImages(newsPost.images);
      }
    }
    if (reqBody.title) {
      newsPost.title = reqBody.title;
    }
    if (reqBody.category) {
      newsPost.category = reqBody.category;
    }
    if (reqBody.description) {
      newsPost.description = reqBody.description;
    }
    if (reqBody.readingTime) {
      newsPost.readingTime = reqBody.readingTime;
    }
    if (reqBody.shortDescription) {
      newsPost.shortDescription = reqBody.shortDescription;
    }
    if (reqBody.images) {
      newsPost.images = reqBody.images;
    }
    if (reqBody.metaTags) {
      newsPost.metaTags = JSON.parse(reqBody.metaTags);
    }
    if (reqBody.metaDescription) {
      newsPost.metaDescription = reqBody.metaDescription;
    }
    console.log(reqBody.metaTags);
    await newsPost.save();
    const response = new ResponseBody("Successfully updated the news", false, {});
    responseHandler(res, next, response, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.deleteNewsPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let newsId = req.body.newsId;
    let filter = { _id: newsId };
    let newsPost = await newsPostService.getOneNewsPost(filter);
    const deleteNewsPostImages = async (images) => {
      for (const imagePath of images) {
        const fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
        const fullPath = path.join(__dirname, `../public/newsPostImages/${fileName}`);
        try {
          await fs.promises.unlink(fullPath);
          console.log(`Successfully deleted: ${fullPath}`);
        } catch (error) {
          console.error(`Error deleting file: ${fullPath}\n`, error);
        }
      }
    };
    if (newsPost.images.length) {
      deleteNewsPostImages(newsPost.images);
    }
    await newsPostService.deleteNewsPost(filter);
    const response = new ResponseBody("Successfully deleted the news", false, {});
    responseHandler(res, next, response, 200);
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
    await newsPostService.updateStatusByID(id, blockedStatus);
    const response = new ResponseBody("Successfully changed status", false, {});
    responseHandler(res, next, response, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

/////////////////////////////////////////////// user controller ///////////////////////////////////////////////////
exports.userGetAllNewsPosts = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let page = parseInt(reqQuery.page);
    let size = parseInt(reqQuery.size);
    let title = reqQuery.title ? reqQuery.title.replace(/\s+/g, " ").split(" ").join(".*") : "";
    let category = reqQuery.category ? mongoose.Types.ObjectId(reqQuery.category) : "";
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let options = { page, size, title, category };
    let newsPosts = await newsPostService.userGetNewsPostsWithFilters(options);
    const response = new ResponseBody("Successfully retrieved  newss", false, {
      maxRecords: newsPosts.length ? newsPosts[0].maxRecords : 0,
      newsPosts: newsPosts.length ? newsPosts[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetLatestNewsPosts = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let size = parseInt(reqQuery.size);
    size = isNaN(size) ? 5 : size;
    if (size === 0) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    let options = { size };
    let newsPosts = await newsPostService.userGetLatestNews(options);
    const response = new ResponseBody("Successfully retrieved  latest newss", false, {
      newsPosts,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetLatestNewsWithoutDescription = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let size = parseInt(reqQuery.size);
    size = isNaN(size) ? 5 : size;
    if (size === 0) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    let options = { size };
    let newsPosts = await newsPostService.userGetLatestNewsWithoutDescription(options);
    const response = new ResponseBody("Successfully retrieved  latest newss", false, {
      newsPosts,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetOneNewsPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let newsId = req.query.newsId;
    let filter = { _id: newsId, isBlocked: false };
    let newsPost = await newsPostService.getOneNewsPost(filter);
    if (!newsPost) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    const response = new ResponseBody("Successfully retrieved  news", false, {
      newsPost,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetAllNewsFromCategory = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let page = parseInt(reqQuery.page);
    let size = parseInt(reqQuery.size);
    let categoryId = mongoose.Types.ObjectId(reqQuery.categoryId);
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let options = { page, size, categoryId };
    let newsPosts = await newsPostService.userGetNewsPostsFromCategories(options);
    const response = new ResponseBody("Successfully retrieved  newss", false, {
      maxRecords: newsPosts.length ? newsPosts[0].maxRecords : 0,
      newsPosts: newsPosts.length ? newsPosts[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetOtherNewsFromCategory = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let page = parseInt(reqQuery.page);
    let size = parseInt(reqQuery.size);
    let categoryId = mongoose.Types.ObjectId(reqQuery.categoryId);
    let newsId = mongoose.Types.ObjectId(reqQuery.newsId);
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let options = { page, size, categoryId, newsId };
    let newsPosts = await newsPostService.userGetOtherNewsPostsFromCategories(options);
    const response = new ResponseBody("Successfully retrieved  newss", false, {
      maxRecords: newsPosts.length ? newsPosts[0].maxRecords : 0,
      newsPosts: newsPosts.length ? newsPosts[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userNewsPostMetaData = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { id } = req.query;
    let newsPost = await newsPostService.findNewsById(
      id,
      "-_id title metaDescription metaTags images"
    );
    if (!newsPost) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    const response = new ResponseBody("Successfully retrieved  news meta", false, {
      title: newsPost.title,
      description: newsPost.metaDescription || "Maqlink News",
      keywords: newsPost.metaTags ? newsPost.metaTags.join(",") : "Maqlink,News",
      image: process.env.SERVER_URL + newsPost.images[0],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};
