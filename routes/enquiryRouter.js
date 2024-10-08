const router = require("express").Router();
const { body, query } = require("express-validator");
const { enquiryController } = require("../controllers/_index");
const {
  verifyAdmin: { verifyAdmin },
  verifySuperAdmin: { verifySuperAdmin },
} = require("../middlewares/_index");

///////////////////////////////////////////////// Admin Routes //////////////////////////////////////////////////

const adminGetEnquiriesValidator = [
  query("page")
    .optional({ checkFalsy: true })
    .custom((val) => val >= 0),
  query("size")
    .optional({ checkFalsy: true })
    .custom((val) => val > 0),
  query("name").optional({ checkFalsy: true }),
  query("email").optional({ checkFalsy: true }),
  query("phone").optional({ checkFalsy: true }),
  query("organisation").optional({ checkFalsy: true }),
  query("serviceFor").optional({ checkFalsy: true }).isIn(["SELF", "COMPANY"]),
  query("startDate").optional({ checkFalsy: true }),
  query("endDate").optional({ checkFalsy: true }),
  query("service").optional({ checkFalsy: true }),
];

const exportEnquiriesValidator = [
  body("name").optional({ checkFalsy: true }),
  body("email").optional({ checkFalsy: true }),
  body("phone").optional({ checkFalsy: true }),
  body("organisation").optional({ checkFalsy: true }),
  body("serviceFor").optional({ checkFalsy: true }).isIn(["SELF", "COMPANY"]),
  body("startDate").optional({ checkFalsy: true }),
  body("endDate").optional({ checkFalsy: true }),
  body("service").optional({ checkFalsy: true }),
];
///////// get all enquiries //////
router.get("/all", adminGetEnquiriesValidator, verifyAdmin, enquiryController.getAllEnquiries);

///////// export enquiries //////
router.post("/export", exportEnquiriesValidator, enquiryController.exportEnquiries);

/////////////////////////////////////////// user Routes //////////////////////////////////////////////////

const enquiryAddValidator = [
  body("name").trim().notEmpty(),
  body("email").trim().notEmpty(),
  body("phone").trim().notEmpty(),
  body("organisation").trim().notEmpty(),
  body("message").trim().optional({ checkFalsy: true }),
  body("servicesFor").trim().notEmpty().isIn(["SELF", "COMPANY"]),
  body("services").isArray().notEmpty(),
];

///////// add new enquiry //////
router.post("/", enquiryAddValidator, enquiryController.addNewEnquiry);

module.exports = router;
