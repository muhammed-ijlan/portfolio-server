const router = require("express").Router();
const { body, query } = require("express-validator");
const { configurationController } = require("../controllers/_index");
const {
  verifyAdmin: { verifyAdmin },
  verifySuperAdmin: { verifySuperAdmin },
} = require("../middlewares/_index");

///////////////////////////////////////////////// Admin Routes //////////////////////////////////////////////////
const designationAddValidator = [body("designation").trim().notEmpty()];

const certificateAddValidator = [body("certificate").trim().notEmpty()];


//////// add new designation////
router.post(
  "/admin/designation",
  verifyAdmin,
  designationAddValidator,
  configurationController.addNewDesignation
);

//////// add new certificate////
router.post(
  "/admin/certificate", 
  verifyAdmin,
  certificateAddValidator,
  configurationController.addNewCertificate
);

/////// get all designations //////
router.get(
  "/admin/designations",
  verifyAdmin,
  configurationController.getAllDesignations
);

/////// get all certificates //////
router.get(
  "/admin/certificates",
  verifyAdmin, 
  configurationController.getAllCertificates
);


module.exports = router;
