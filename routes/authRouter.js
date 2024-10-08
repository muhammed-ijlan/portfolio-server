const router = require("express").Router();
const { body, query } = require("express-validator");
const { authController } = require("../controllers/_index");
const { verifyAdmin: { verifyAdmin } } = require("../middlewares/_index");



// Admin


const superAdminSignupValidator = [
    body('fullname').trim().toLowerCase().notEmpty(),
    body('email').trim().toLowerCase().isEmail(),
    body('password').trim().isLength({ min: 8, max: 20 })
];

const memberSignInValidator = [
    body('email').trim().toLowerCase().isEmail(),
    body('password').trim().isLength({ min: 8, max: 20 })
];


router.post("/register/super", superAdminSignupValidator, authController.registerSuperAdmin);

router.post("/member/login", memberSignInValidator, authController.loginMember);

router.post("/member/logout", verifyAdmin, authController.logOutMember);







module.exports = router;