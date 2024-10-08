const router = require("express").Router();

const { body, query } = require("express-validator");
const { enquiryCategoryController } = require("../controllers/_index");

const createEnquiryCategoryValidator = [
    body("name").trim().toLowerCase().notEmpty(),
    body("isBlocked").optional({ checkFalsy: true }).isIn([true, false]),
]
const enquiryCategoryQueryValidator = [
    query("page").optional({ checkFalsy: true }).custom((val) => parseInt(val) >= 0),
    query("size").optional({ checkFalsy: true }).custom((val) => parseInt(val) > 0),
];

router.post("/create", createEnquiryCategoryValidator, enquiryCategoryController.createEnquiryCategory)
router.get("/getall", enquiryCategoryQueryValidator, enquiryCategoryController.getAllEnquiryCategories);
router.post("/update", createEnquiryCategoryValidator, enquiryCategoryController.updateEnquiryCategory)

module.exports = router;