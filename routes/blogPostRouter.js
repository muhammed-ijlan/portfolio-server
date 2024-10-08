const router = require("express").Router();
const { body, query } = require("express-validator");
const { blogPostController } = require("../controllers/_index");
const { multerBlogPostImageUpload } = require("../services/_index").multerService;
const {
  verifyAdmin: { verifyAdmin },
  verifySuperAdmin: { verifySuperAdmin },
} = require("../middlewares/_index");

/////////////////////////////////// Admin Routes /////////////////////////////////////
const createBlogBodyValidator = [
  body("title").trim().toUpperCase().notEmpty(),
  body("category").trim().notEmpty(),
  body("description").trim().notEmpty(),
  body("readingTime").trim().notEmpty(),
  body("shortDescription").trim().optional({ checkFalsy: true }),
  body("metaDescription").trim().optional({ checkFalsy: true }),
  body("metaTags").trim().optional({ checkFalsy: true }),
];

const getBlogsQueryValidator = [
  query("page")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("size")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("title").trim().optional({ checkFalsy: true }),
  query("category").trim().optional({ checkFalsy: true }),
  query("readingTime").trim().optional({ checkFalsy: true }),
  query("blogId").trim().optional({ checkFalsy: true }),
  query("startDate").trim().optional({ checkFalsy: true }),
  query("endDate").trim().optional({ checkFalsy: true }),
  body("isBlocked").isIn([true, false]).optional({ checkFalsy: true }),
];

const updateBlogBodyValidator = [
  body("blogId").trim().notEmpty(),
  body("title").trim().toUpperCase().optional({ checkFalsy: true }),
  body("category").trim().optional({ checkFalsy: true }),
  body("description").trim().optional({ checkFalsy: true }),
  body("readingTime").trim().optional({ checkFalsy: true }),
  body("shortDescription").trim().optional({ checkFalsy: true }),
  body("metaDescription").trim().optional({ checkFalsy: true }),
  body("metaTags").trim().optional({ checkFalsy: true }),
];

const getOneBlogQueryValidator = [query("blogId").trim().notEmpty()];

const deleteBlogBodyValidator = [body("blogId").trim().notEmpty()];

const updateStatusQueryValidator = [
  body("id").trim().notEmpty(),
  body("status").isIn([true, false]),
];

/////////// create blog post /////////////
router.post(
  "/",
  verifyAdmin,
  multerBlogPostImageUpload().array("images"),
  createBlogBodyValidator,
  blogPostController.addBlogPost
);

///////// get blog posts ////////////
router.get("/all", verifyAdmin, getBlogsQueryValidator, blogPostController.getAllBlogPosts);

//////// get one blog post  ///////
router.get("/", verifyAdmin, getOneBlogQueryValidator, blogPostController.getOneBlogPost);

/////// Edit blog post ///////
router.put(
  "/",
  verifyAdmin,
  multerBlogPostImageUpload().array("images"),
  updateBlogBodyValidator,
  blogPostController.updateBlogPost
);

////// Delete blog post //////
router.post("/delete", verifyAdmin, deleteBlogBodyValidator, blogPostController.deleteBlogPost);

////// change status ////
router.put("/status", verifyAdmin, updateStatusQueryValidator, blogPostController.changeStatus);

////////////////////////////////////////////// user routes //////////////////////

const userGetBlogsQueryValidator = [
  query("page")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("size")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("title").trim().optional({ checkFalsy: true }),
  query("category").trim().optional({ checkFalsy: true }),
];

const userGetLatestBlogsQueryValidator = [
  query("size")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
];

const userGetOneBlogQueryValidator = [query("blogId").trim().notEmpty()];
const userGetOneBlogMetaQueryValidator = [query("id").trim().notEmpty()];


const userGetBlogsFromCategoriesQueryValidator = [
  query("page")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("size")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("categoryId").trim().notEmpty(),
];

const userGetOtherFromCategoryQueryValidator = [
  query("page")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("size")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("categoryId").trim().notEmpty(),
  query("blogId").trim().notEmpty(),
];

///////// get all blog posts ////////////
router.get("/user/all", userGetBlogsQueryValidator, blogPostController.userGetAllBlogPosts);

///////// get latest blogs with description////////////
router.get(
  "/user/latest/description",
  userGetLatestBlogsQueryValidator,
  blogPostController.userGetLatestBlogPosts
);
///////// get all blog posts without description////////////
router.get(
  "/user/latest/",
  userGetLatestBlogsQueryValidator,
  blogPostController.userGetLatestBlogWithoutDescription
);

///////// get one blogpost /////////
router.get("/user", userGetOneBlogQueryValidator, blogPostController.userGetOneBlogPost);

///////// get Blogs from a category ////////
router.get(
  "/user/all/category",
  userGetBlogsFromCategoriesQueryValidator,
  blogPostController.userGetAllBlogsFromCategory
);

///////// get Blogs from a category except selected one ////////
router.get(
  "/user/other/category",
  userGetOtherFromCategoryQueryValidator,
  blogPostController.userGetOtherBlogsFromCategory
);

/////// get meta data for blog post ///////
router.get("/user/meta", userGetOneBlogMetaQueryValidator, blogPostController.userGetBlogPostMetaData);

module.exports = router;
