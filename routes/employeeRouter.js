const router = require("express").Router();
const { body, query } = require("express-validator");
const { employeeController } = require("../controllers/_index");
const {
  verifyAdmin: { verifyAdmin },
  verifySuperAdmin: { verifySuperAdmin },
} = require("../middlewares/_index");
const { multerEmployeeProfileImageUpload } = require("../services/_index").multerService;
// const { publicFileUpload } = require("../services/_index").spaceService;

const createEmployeeValidator = [
  body("fullname").notEmpty().isString().isLength({ min: 3, max: 50 }),
  body("email").notEmpty().isEmail().isLength({ min: 3, max: 50 }),
  body("password").notEmpty().isString().isLength({ min: 8, max: 20 }),
  // body("designation").notEmpty().isString(),
  body("accType").isString().notEmpty().isIn(["TELECALLER", "ENQUIRY_MANAGER"]),
  body("phone").optional({ checkFalsy: true }),
];

const getAllEmployeesValidator = [
  query("page")
    .optional({ checkFalsy: true })
    .custom((val) => val >= 0),
  query("size")
    .optional({ checkFalsy: true })
    .custom((val) => val > 0),
  query("isBlocked").optional({ checkFalsy: true }).toBoolean(),
  query("startDate").optional({ checkFalsy: true }),
  query("endDate").optional({ checkFalsy: true }),
  query("fullname").optional({ checkFalsy: true }),
  query("email").optional({ checkFalsy: true }),
  query("designation").optional({ checkFalsy: true }),
  query("phone").optional({ checkFalsy: true }),
  query("id").optional({ checkFalsy: true }),
];

const updateEmployeeStatusBodyValidator = [
  body("id").trim().notEmpty(),
  body("isBlocked").isIn([true, false])
];

const updateEmployeeBodyValidator = [
  body('id').trim().notEmpty(),
  body('fullname').trim().toLowerCase().optional({ checkFalsy: true }),
  body('email').trim().toLowerCase().optional({ checkFalsy: true }).isEmail(),
  body('password').trim().optional({ checkFalsy: true }).isLength({ min: 8, max: 20 })
];

const getEmployeeQueryValdator = [
  query('employeeId').trim().notEmpty()
]
////// create employee //////
// router.post(
//   "/admin/create",
//   publicFileUpload.single("profilePic"),
//   createEmployeeValidator,
//   verifyAdmin,
//   employeeController.createEmployee
// );

////// get all employees //////
// router.get("/admin/all", getAllEmployeesValidator, verifyAdmin, employeeController.getAllEmployees);

// router.post("/add-employee", verifyAdmin, createEmployeeValidator, employeeController.createEmployee);
// router.post("/employee-status", verifyAdmin, updateEmployeeStatusBodyValidator, employeeController.employeeStatusUpdate);
// router.get("/all-employees", verifyAdmin, getAllEmployeesValidator, employeeController.getAllEmployees);
// router.put("/update-employee", verifyAdmin, multerEmployeeProfileImageUpload().single("profilePic"), updateEmployeeBodyValidator, employeeController.updateEmployee);

// router.get("/get-employee", getEmployeeQueryValdator, employeeController.getEmployeeProfile);

module.exports = router;