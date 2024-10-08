const router = require("express").Router();
const { body, query } = require("express-validator");

const { enquirySourceController } = require("../controllers/_index");
const { verifyAdmin: { verifyAdmin } } = require("../middlewares/_index");

const createSourceBodyValidator = [
    body("name").trim().toLowerCase().notEmpty()
];

const updateSourceBodyValidator = [
    body("isBlocked").optional({ checkFalsy: true }).isIn([true, false]),
    body("id").trim().notEmpty(),
    body("name").trim().toLowerCase().optional({ checkFalsy: true }),
];

const getSourceQueryValidator = [
    query("page").optional({ checkFalsy: true }).custom(val => parseInt(val) > 0),
    query("size").optional({ checkFalsy: true }).custom(val => parseInt(val) > 0),
]

router.post("/add", verifyAdmin, createSourceBodyValidator, enquirySourceController.createEnquirySource);
router.put("/update", verifyAdmin, updateSourceBodyValidator, enquirySourceController.updateEnquirySource);
router.get("/getall", verifyAdmin, getSourceQueryValidator, enquirySourceController.getAllEnquirySources);

module.exports = router;