const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const { blogPostService } = require("../services/_index");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

////////////////////////////// Admin Controllers ///////////////////////////

exports.addBlogPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    let files = req.files;
    if (files.length) {
      reqBody["images"] = files.map((item) => {
        return "/blogPostImages/" + item.filename;
      });
    }
    if (reqBody.metaTags) {
      reqBody.metaTags = JSON.parse(reqBody.metaTags);
    }
    await blogPostService.createBlogPost(reqBody);
    const response = new ResponseBody("Successfully added blog post", false, {});
    responseHandler(res, next, response, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getAllBlogPosts = async (req, res, next) => {
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
    let blogId = reqQuery.blogId ? mongoose.Types.ObjectId(reqQuery.blogId) : null;
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
      blogId,
      startDate,
      endDate,
      isBlocked,
    };
    let blogPosts = await blogPostService.getBlogPostsWithFilters(options);
    const response = new ResponseBody("Successfully retrieved  blogs", false, {
      maxRecords: blogPosts.length ? blogPosts[0].maxRecords : 0,
      blogPosts: blogPosts.length ? blogPosts[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getOneBlogPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let blogId = req.query.blogId;
    let filter = { _id: blogId };
    let blogPost = await blogPostService.getOneBlogPost(filter);
    if (!blogPost) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    const response = new ResponseBody("Successfully retrieved  blog", false, {
      blogPost,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.updateBlogPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    let blogId = reqBody.blogId;
    let files = req.files;
    let filter = { _id: blogId };
    let blogPost = await blogPostService.getOneBlogPost(filter);
    if (!blogPost) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    if (files.length) {
      reqBody["images"] = files.map((item) => {
        return "/blogPostImages/" + item.filename;
      });
      const deleteBlogPostImages = async (images) => {
        for (const imagePath of images) {
          const fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
          const fullPath = path.join(__dirname, `../public/blogPostImages/${fileName}`);

          try {
            await fs.promises.unlink(fullPath);
            console.log(`Successfully deleted: ${fullPath}`);
          } catch (error) {
            console.error(`Error deleting file: ${fullPath}\n`, error);
          }
        }
      };
      if (blogPost.images.length) {
        deleteBlogPostImages(blogPost.images);
      }
    }
    if (reqBody.title) {
      blogPost.title = reqBody.title;
    }
    if (reqBody.category) {
      blogPost.category = reqBody.category;
    }
    if (reqBody.description) {
      blogPost.description = reqBody.description;
    }
    if (reqBody.readingTime) {
      blogPost.readingTime = reqBody.readingTime;
    }
    if (reqBody.shortDescription) {
      blogPost.shortDescription = reqBody.shortDescription;
    }
    if (reqBody.images) {
      blogPost.images = reqBody.images;
    }
    if (reqBody.metaTags) {
      blogPost.metaTags = JSON.parse(reqBody.metaTags);
    }
    if (reqBody.metaDescription) {
      blogPost.metaDescription = reqBody.metaDescription;
    }
    console.log(reqBody.metaTags)
    await blogPost.save();
    const response = new ResponseBody("Successfully updated the blog", false, {});
    responseHandler(res, next, response, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.deleteBlogPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let blogId = req.body.blogId;
    let filter = { _id: blogId };
    let blogPost = await blogPostService.getOneBlogPost(filter);
    const deleteBlogPostImages = async (images) => {
      for (const imagePath of images) {
        const fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
        const fullPath = path.join(__dirname, `../public/blogPostImages/${fileName}`);
        try {
          await fs.promises.unlink(fullPath);
          console.log(`Successfully deleted: ${fullPath}`);
        } catch (error) {
          console.error(`Error deleting file: ${fullPath}\n`, error);
        }
      }
    };
    if (blogPost.images.length) {
      deleteBlogPostImages(blogPost.images);
    }
    await blogPostService.deleteBlogPost(filter);
    const response = new ResponseBody("Successfully deleted the blog", false, {});
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
    await blogPostService.updateStatusByID(id, blockedStatus);
    const response = new ResponseBody("Successfully changed status", false, {});
    responseHandler(res, next, response, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

/////////////////////////////////////////////// user controller ///////////////////////////////////////////////////
exports.userGetAllBlogPosts = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let page = parseInt(reqQuery.page);
    let size = parseInt(reqQuery.size);
    let title = reqQuery.title ? reqQuery.title.replace(/\s+/g, " ").split(" ").join(".*") : "";
    let category = reqQuery.category ? mongoose.Types.ObjectId(reqQuery.category) : null;
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let options = { page, size, title, category };
    let blogPosts = await blogPostService.userGetBlogPostsWithFilters(options);
    const response = new ResponseBody("Successfully retrieved  blogs", false, {
      maxRecords: blogPosts.length ? blogPosts[0].maxRecords : 0,
      blogPosts: blogPosts.length ? blogPosts[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetLatestBlogPosts = async (req, res, next) => {
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
    let blogPosts = await blogPostService.userGetLatestBlogs(options);
    const response = new ResponseBody("Successfully retrieved  latest blogs", false, {
      blogPosts,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetLatestBlogWithoutDescription = async (req, res, next) => {
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
    let blogPosts = await blogPostService.userGetLatestBlogsWithoutDescription(options);
    const response = new ResponseBody("Successfully retrieved  latest blogs", false, {
      blogPosts,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetOneBlogPost = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let blogId = req.query.blogId;
    let filter = { _id: blogId, isBlocked: false };
    let blogPost = await blogPostService.getOneBlogPost(filter);
    if (!blogPost) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    const response = new ResponseBody("Successfully retrieved  blog", false, {
      blogPost,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetAllBlogsFromCategory = async (req, res, next) => {
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
    let blogPosts = await blogPostService.userGetBlogPostsFromCategories(options);
    const response = new ResponseBody("Successfully retrieved  blogs", false, {
      maxRecords: blogPosts.length ? blogPosts[0].maxRecords : 0,
      blogPosts: blogPosts.length ? blogPosts[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetOtherBlogsFromCategory = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let page = parseInt(reqQuery.page);
    let size = parseInt(reqQuery.size);
    let categoryId = mongoose.Types.ObjectId(reqQuery.categoryId);
    let blogId = mongoose.Types.ObjectId(reqQuery.blogId);
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let options = { page, size, categoryId, blogId };
    let blogPosts = await blogPostService.userGetOtherBlogPostsFromCategories(options);
    const response = new ResponseBody("Successfully retrieved  blogs", false, {
      maxRecords: blogPosts.length ? blogPosts[0].maxRecords : 0,
      blogPosts: blogPosts.length ? blogPosts[0].data : [],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.userGetBlogPostMetaData = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { id } = req.query;
    let blogPost = await blogPostService.findBlogById(
      id,
      "-_id title metaDescription metaTags images"
    );
    if (!blogPost) {
      throw new ErrorBody(400, "Bad Inputs", []);
    }
    const response = new ResponseBody("Successfully retrieved  blog meta", false, {
      title: blogPost.title,
      description: blogPost.metaDescription || "Maqlink Blog",
      keywords: blogPost.metaTags ? blogPost.metaTags.join(",") : "Maqlink,Blog",
      image: process.env.SERVER_URL + blogPost.images[0],
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};
