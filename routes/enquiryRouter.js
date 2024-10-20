const router = require("express").Router();
const { body, query } = require("express-validator");
const { enquiryController } = require("../controllers/_index");
const {
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
  query("subject").optional({ checkFalsy: true }),
];
const adminGetOneEnquiryValidator = [
  query("id").isMongoId().notEmpty(),
];

// const exportEnquiriesValidator = [
//   body("name").optional({ checkFalsy: true }),
//   body("email").optional({ checkFalsy: true }),
//   body("phone").optional({ checkFalsy: true }),
//   body("organisation").optional({ checkFalsy: true }),
//   body("serviceFor").optional({ checkFalsy: true }).isIn(["SELF", "COMPANY"]),
//   body("startDate").optional({ checkFalsy: true }),
//   body("endDate").optional({ checkFalsy: true }),
//   body("service").optional({ checkFalsy: true }),
// ];
// ///////// get all enquiries //////
router.get("/all", adminGetEnquiriesValidator, verifySuperAdmin, enquiryController.getAllEnquiries);
router.get("/one", adminGetOneEnquiryValidator, verifySuperAdmin, enquiryController.getOneEnquiry);

///////// export enquiries //////
// router.post("/export", exportEnquiriesValidator, enquiryController.exportEnquiries);

/////////////////////////////////////////// user Routes //////////////////////////////////////////////////

const enquiryAddValidator = [
  body("name").trim().notEmpty(),
  body("email").trim().notEmpty(),
  body("subject").trim().notEmpty(),
  body("message").trim().optional({ checkFalsy: true }),
]

///////// add new enquiry //////
router.post("/", enquiryAddValidator, enquiryController.addNewEnquiry);

module.exports = router;
