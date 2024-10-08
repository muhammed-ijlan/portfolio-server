const router = require("express").Router();
const { body, query } = require("express-validator");
const { jobQueueController } = require("../controllers/_index");
const {
  verifyAdmin: { verifyAdmin },
} = require("../middlewares/_index");

///////////// Get all enquiry export jobs/////
router.get("/enquiry/export", verifyAdmin, jobQueueController.getAllEnquiryExportJobs);

router.get("/enquiry/download", jobQueueController.getEnquiryExportDownloadLink);

module.exports = router;
