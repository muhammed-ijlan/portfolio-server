const router = require("express").Router();
const { body, query } = require("express-validator");
const { verifyFileDownload } = require("../middlewares/_index");


/////////////////////// ADMIN /////////////////////

const downloadQueryValidator = [
    query("token").trim().notEmpty()
]


router.get("/admin/enquiry", downloadQueryValidator, verifyFileDownload.verify);







module.exports = router;