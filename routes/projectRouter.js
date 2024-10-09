const router = require("express").Router();
const { query, body } = require("express-validator");
const { adminController, projectController } = require("../controllers/_index");
const { verifySuperAdmin: { verifySuperAdmin } } = require("../middlewares/_index");
const { multerProjectImageUpload, multerImageUpload } = require("../services/multerService");


const updateMemberProfileValidator = [
  body('projectName').trim().optional({ checkFalsy: true }),
  body('projectLink').trim().optional({ checkFalsy: true }),
];


router.get("/all", verifySuperAdmin, projectController.getAllProjects);


router.get("/one", verifySuperAdmin, query("projectId").notEmpty(), projectController.getOneProject);

router.delete("/delete", verifySuperAdmin, projectController.deleteProject);

router.post("/create", verifySuperAdmin,
  multerImageUpload().array("images"), projectController.addProject);


router.put("/", verifySuperAdmin,
  multerImageUpload().array("images"), projectController.updateProject);


router.get("/public/all", projectController.getAllProjects);




module.exports = router;
