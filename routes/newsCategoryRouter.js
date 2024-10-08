const router = require("express").Router();
const { body, query } = require("express-validator");
const {  newsCategoryController } = require("../controllers/_index");
const {
  verifyAdmin: { verifyAdmin },
  verifySuperAdmin: { verifySuperAdmin },
} = require("../middlewares/_index");

//////////////////////////////// Admin Routes ///////////////////////
const createCategoryBodyValidator = [body("name").trim().toUpperCase().notEmpty()];
const updateStatusQueryValidator = [
  body("id").trim().notEmpty(),
  body("status").isIn([true, false]),
];

const getAllCategoriesQueryValidator = [
  query("id").trim().optional({ checkFalsy: true }),
  query("isBlocked").optional({ checkFalsy: true }).isIn([true, false, "ALL"]),
  query("page")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("size")
    .optional({ checkFalsy: true })
    .custom((value) => value >= 0),
  query("name").trim().optional({ checkFalsy: true }),
];

const editProductsBodyValidator = [
  body("id").trim().notEmpty(),
  body("name").optional({ checkFalsy: true }),
  body("priority").optional({ checkFalsy: true }).toInt(),
];

/////// create category ///////
router.post("/", verifyAdmin, createCategoryBodyValidator, newsCategoryController.addCategory);

////// get categories ///////
router.get(
  "/",
  verifyAdmin,
  getAllCategoriesQueryValidator,
  newsCategoryController.getCategories
);

////// get active categories ///////
router.get(
  "/active",
  verifyAdmin,
  getAllCategoriesQueryValidator,
  newsCategoryController.getActiveCategories
);

////// Edit category ////
router.put(
  "/",
  verifyAdmin,
  editProductsBodyValidator,
  newsCategoryController.editCategoty
);


////// change status ////
router.put(
  "/status",
  verifyAdmin,
  updateStatusQueryValidator,
  newsCategoryController.changeStatus
);

/////////////////////////////////////////////////// user routes ///////////////////////////////////////
////// get categories ///////
router.get("/user", newsCategoryController.userGetCategories);

module.exports = router;
