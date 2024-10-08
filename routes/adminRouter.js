const router = require("express").Router();
const { query, body } = require("express-validator");
const { adminController } = require("../controllers/_index");
const { verifySuperAdmin: { verifySuperAdmin } } = require("../middlewares/_index");


const updateMemberProfileValidator = [
  body('fullname').trim().toLowerCase().optional({ checkFalsy: true }).notEmpty(),
  body('email').trim().toLowerCase().optional({ checkFalsy: true }).isEmail().notEmpty(),
  body('password').trim().optional({ checkFalsy: true }).isLength({ min: 8, max: 20 }),

];


router.get("/profile", verifySuperAdmin, adminController.getMember);

router.put("/profile", verifySuperAdmin, updateMemberProfileValidator, adminController.updateMemberProfile);


module.exports = router;
