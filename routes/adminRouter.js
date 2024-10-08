const router = require("express").Router();
const { query, body } = require("express-validator");
const { adminController } = require("../controllers/_index");
const { verifyMember: { verifyMember },
  verifySuperAdmin: { verifySuperAdmin },
  verifyAdmin: { verifyAdmin } } = require("../middlewares/_index");
const { multerMemberProfileImageUpload } = require("../services/_index").multerService;


const updateMemberProfileValidator = [
  body('fullname').trim().toLowerCase().optional({ checkFalsy: true }),
  body('email').trim().toLowerCase().optional({ checkFalsy: true }).isEmail(),
  body('password').trim().optional({ checkFalsy: true }).isLength({ min: 8, max: 20 }),

];

const updateMemberValidator = [
  body('password').trim().isLength({ min: 8, max: 20 }),
];


router.get("/profile", verifySuperAdmin, updateMemberProfileValidator, adminController.getMember);

router.put("/profile", verifySuperAdmin, updateMemberProfileValidator, adminController.updateMemberProfile);

router.put("/profile", verifySuperAdmin, updateMemberValidator, adminController.updateMemberProfile);

module.exports = router;
