const router = require("express").Router();
const { query, body } = require("express-validator");
const { memberController } = require("../controllers/_index");
const { verifyMember: { verifyMember },
  verifySuperAdmin: { verifySuperAdmin },
  verifyAdmin: { verifyAdmin } } = require("../middlewares/_index");
const { multerMemberProfileImageUpload } = require("../services/_index").multerService;




const addMemberBodyValidator = [
  body('fullname').trim().toLowerCase().notEmpty(),
  body('email').trim().toLowerCase().isEmail(),
  body('password').trim().isLength({ min: 8, max: 20 }),
  body('accType').notEmpty().isIn(['TELE_CALLER', 'ENQUIRY_MANAGER']),
];


const addSubAdminBodyValidator = [
  body('fullname').trim().toLowerCase().notEmpty(),
  body('email').trim().toLowerCase().isEmail(),
  body('password').trim().isLength({ min: 8, max: 20 }),
  body('accessList').custom(val => {
    return true;
  }),
];


const getMemberQueryValidator = [
  query("id").trim().notEmpty()
];


const updateMemberStatusBodyValidator = [
  body("id").trim().notEmpty(),
  body("isBlocked").isIn([true, false])
];

const employeesGetQueryValidator = [
  query("page").optional({ checkFalsy: true }).custom((val) => parseInt(val) >= 0),
  query("size").optional({ checkFalsy: true }).custom((val) => parseInt(val) > 0),
  query("id").trim().optional({ checkFalsy: true }),
  query("fullname").trim().optional({ checkFalsy: true }).toUpperCase(),
  query("isBlocked").optional({ checkFalsy: true }).isIn(["true", "false"]),
  query("role").optional({ checkFalsy: true }).isIn(["TELE_CALLER", "LEAD_MANAGER"]),
  query("email").trim().optional({ checkFalsy: true })


];

const subadminsGetQueryValidator = [
  query("page").optional({ checkFalsy: true }).custom((val) => parseInt(val) >= 0),
  query("size").optional({ checkFalsy: true }).custom((val) => parseInt(val) > 0),

];

const updateMemberBodyValidator = [
  body('id').trim().notEmpty(),
  body('fullname').trim().toLowerCase().optional({ checkFalsy: true }),
  body('email').trim().toLowerCase().optional({ checkFalsy: true }).isEmail(),
  body('password').trim().optional({ checkFalsy: true }).isLength({ min: 8, max: 20 })
];

const updateSubAmdinValidator = [
  body('id').trim().notEmpty(),
  body('fullname').trim().toLowerCase().optional({ checkFalsy: true }),
  body('email').trim().toLowerCase().optional({ checkFalsy: true }).isEmail(),
  body('password').trim().optional({ checkFalsy: true }).isLength({ min: 8, max: 20 }),
  body('accessList').optional({ checkFalsy: true }).custom(val => {
    return true;
  }),
];

const updateMemberProfileValidator = [
  body('fullname').trim().toLowerCase().optional({ checkFalsy: true }),
  body('email').trim().toLowerCase().optional({ checkFalsy: true }).isEmail(),
  body('password').trim().optional({ checkFalsy: true }).isLength({ min: 8, max: 20 }),

];

const updateMemberValidator = [
  body('password').trim().isLength({ min: 8, max: 20 }),
];

router.post("/employee", verifyAdmin, addMemberBodyValidator, memberController.addEmployee);

router.post("/subadmin", verifySuperAdmin, addSubAdminBodyValidator, memberController.addSubAdmin);

router.get("/", verifyMember, getMemberQueryValidator, memberController.getMember);

router.post("/employee/status", verifyAdmin, updateMemberStatusBodyValidator, memberController.memberStatusChange);

router.post("/subadmin/status", verifySuperAdmin, updateMemberStatusBodyValidator, memberController.memberStatusChange);

router.get("/employee/all", verifyAdmin, employeesGetQueryValidator, memberController.getEmployees);

router.get("/subadmin/all", verifySuperAdmin, subadminsGetQueryValidator, memberController.getSubadmins);

router.put("/employee", verifyAdmin, multerMemberProfileImageUpload().single("profilePic"), updateMemberBodyValidator, memberController.updateEmployee);

router.put("/subadmin", verifySuperAdmin, multerMemberProfileImageUpload().single("profilePic"), updateSubAmdinValidator, memberController.updateSubadmin);

router.put("/profile", verifyMember, multerMemberProfileImageUpload().single("profilePic"), updateMemberProfileValidator, memberController.updateMemberProfile);

router.put("/", verifyMember, updateMemberValidator, memberController.updateMember);

module.exports = router;
