const router = require("express").Router();
const { body, query } = require("express-validator");
const { newsPostController } = require("../controllers/_index");
const { multerNewsPostImageUpload } = require("../services/_index").multerService;
const {
  verifyAdmin: { verifyAdmin },
  verifySuperAdmin: { verifySuperAdmin },
} = require("../middlewares/_index");

/////////////////////////////////// Admin Routes /////////////////////////////////////
const createNewsBodyValidator = [
  body("title").trim().toUpperCase().notEmpty(),
  body("category").trim().notEmpty(),
  body("description").trim().notEmpty(),
  body("readingTime").trim().notEmpty(),
  body("shortDescription").trim().optional({ checkFalsy: true }),
  body("metaDescription").trim().optional({ checkFalsy: true }),
  body("metaTags").trim().optional({ checkFalsy: true }),
];

const getNewsQueryValidator = [
  query("page")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("size")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("title").trim().optional({ checkFalsy: true }),
  query("category").trim().optional({ checkFalsy: true }),
  query("readingTime").trim().optional({ checkFalsy: true }),
  query("newsId").trim().optional({ checkFalsy: true }),
  query("startDate").trim().optional({ checkFalsy: true }),
  query("endDate").trim().optional({ checkFalsy: true }),
  body("isBlocked").isIn([true, false]).optional({ checkFalsy: true }),
];

const updateNewsBodyValidator = [
  body("newsId").trim().notEmpty(),
  body("title").trim().toUpperCase().optional({ checkFalsy: true }),
  body("category").trim().optional({ checkFalsy: true }),
  body("description").trim().optional({ checkFalsy: true }),
  body("readingTime").trim().optional({ checkFalsy: true }),
  body("shortDescription").trim().optional({ checkFalsy: true }),
  body("metaDescription").trim().optional({ checkFalsy: true }),
  body("metaTags").trim().optional({ checkFalsy: true }),
];

const getOneNewsQueryValidator = [query("newsId").trim().notEmpty()];

const deleteNewsBodyValidator = [body("newsId").trim().notEmpty()];

const updateStatusQueryValidator = [
  body("id").trim().notEmpty(),
  body("status").isIn([true, false]),
];

/////////// create news post /////////////
router.post(
  "/",
  verifyAdmin,
  multerNewsPostImageUpload().array("images"),
  createNewsBodyValidator,
  newsPostController.addNewsPost
);

///////// get news posts ////////////
router.get("/all", verifyAdmin, getNewsQueryValidator, newsPostController.getAllNewsPosts);

//////// get one news post  ///////
router.get("/", verifyAdmin, getOneNewsQueryValidator, newsPostController.getOneNewsPost);

/////// Edit news post ///////
router.put(
  "/",
  verifyAdmin,
  multerNewsPostImageUpload().array("images"),
  updateNewsBodyValidator,
  newsPostController.updateNewsPost
);

////// Delete news post //////
router.post("/delete", verifyAdmin, deleteNewsBodyValidator, newsPostController.deleteNewsPost);

////// change status ////
router.put("/status", verifyAdmin, updateStatusQueryValidator, newsPostController.changeStatus);

////////////////////////////////////////////// user routes //////////////////////

const userGetNewsQueryValidator = [
  query("page")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("size")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("title").trim().optional({ checkFalsy: true }),
  query("category").trim().optional({ checkFalsy: true }),
];
const userGetLatestNewsQueryValidator = [
  query("size")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
];

const userGetOneNewsQueryValidator = [query("newsId").trim().notEmpty()];
const userGetOneNewsMetaQueryValidator = [query("id").trim().notEmpty()];


const userGetNewsFromCategoriesQueryValidator = [
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
  query("newsId").trim().notEmpty(),
];

///////// get all news posts ////////////
router.get("/user/all", userGetNewsQueryValidator, newsPostController.userGetAllNewsPosts);

///////// get latest newss with description////////////
router.get(
  "/user/latest/description",
  userGetLatestNewsQueryValidator,
  newsPostController.userGetLatestNewsPosts
);
///////// get all news posts without description////////////
router.get(
  "/user/latest/",
  userGetLatestNewsQueryValidator,
  newsPostController.userGetLatestNewsWithoutDescription
);

///////// get one newspost /////////
router.get("/user", userGetOneNewsQueryValidator, newsPostController.userGetOneNewsPost);

///////// get News from a category ////////
router.get(
  "/user/all/category",
  userGetNewsFromCategoriesQueryValidator,
  newsPostController.userGetAllNewsFromCategory
);

///////// get News from a category except selected one ////////
router.get(
  "/user/other/category",
  userGetOtherFromCategoryQueryValidator,
  newsPostController.userGetOtherNewsFromCategory
);


/////// get meta data for news post ///////
router.get("/user/meta", userGetOneNewsMetaQueryValidator, newsPostController.userNewsPostMetaData);

module.exports = router;
