const { enquiryStatusController } = require("../controllers/_index");
const { body, query } = require("express-validator");

const router = require("express").Router();

const addValidator = [
    body("name").toLowerCase().notEmpty()
];

const getStatusQueryValidator = [
    query("page").optional({ checkFalsy: true }).custom(val => parseInt(val) > 0),
    query("size").optional({ checkFalsy: true }).custom(val => parseInt(val) > 0),
]

router.post("/add", addValidator, enquiryStatusController.createEnquiryStatus);
router.get("/all", getStatusQueryValidator, enquiryStatusController.getAllEnquiryStatus);

module.exports = router;