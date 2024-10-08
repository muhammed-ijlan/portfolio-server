const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler, emailTemplates } = require("../utils/_index");
const { employeeService, authService } = require("../services/_index");
const mongoose = require("mongoose");
const moment = require("moment");

exports.createEmployee = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    const reqBody = req.body;
    const profilePic = req.file;
    if (profilePic) {
      reqBody.profilePic = profilePic.location;
    }
    const employee = await employeeService.findEmployeeWithFilters({
      email: reqBody.email,
    });
    if (employee) {
      throw new ErrorBody(400, "Employee already exists");
    }

    await employeeService.createEmployee(reqBody);
    let response = new ResponseBody("Employee successfully created", false, []);
    responseHandler(res, next, response, 201);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.employeeStatusUpdate = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    const { isBlocked, id } = req.body;

    const employee = await employeeService.updateEmployeeWithFilters({ _id: id, }, { isBlocked: isBlocked }, { new: true });

    if (employee.isBlocked) {
      await employeeService.logoutEmployee(id);
    }
    let response = new ResponseBody("Employee status successfully updated", false, {});
    responseHandler(res, next, response, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }

}



exports.getAllEmployees = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let page = parseInt(req.query.page) || 0;
    let size = parseInt(req.query.size) || 10;
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let fullname = reqQuery.fullname
      ? reqQuery.fullname.replace(/\s+/g, " ").split(" ").join(".*")
      : "";
    let id = reqQuery.id ? mongoose.Types.ObjectId(reqQuery.id) : null;
    let email = reqQuery.email ? reqQuery.email : null;
    let startDate = reqQuery.startDate ? new Date(reqQuery.startDate) : null;
    let endDate = reqQuery.endDate ? new Date(reqQuery.endDate) : null;
    let isBlocked = reqQuery.isBlocked !== null ? reqQuery.isBlocked : null;
    let phone = reqQuery.phone ? reqQuery.phone : null;
    const options = {
      page: page,
      size: size,
      fullname,
      id,
      email,
      startDate,
      endDate,
      isBlocked,
      phone,
    };
    const result = await employeeService.getAllEmployees(options);
    let response = new ResponseBody("Employees successfully retrived", false, {
      employees: result.length ? result[0].data : [],
      maxRecords: result.length ? result[0].maxRecords || 0 : 0,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let { id, fullname, email, password } = req.body;
    const employee = await employeeService.findEmployeeWithFilters({ _id: id }, "", {})
    if (!employee) {
      const responseBody = new ResponseBody("Employee doesnt Exists", true, {});
      return responseHandler(res, next, responseBody, 200);
    }
    if (fullname) {
      employee.fullname = fullname;
    }
    if (email) {
      if (employee.email !== email) {
        if (await employeeService.findEmployeeWithFilters({ email: email }, "_id", {})) {
          const responseBody = new ResponseBody("Email already Exists", true, {});
          return responseHandler(res, next, responseBody, 200);
        }
      }
    }
    if (password) {
      await employee.setHash(password);
    }
    let currentProfilePic = employee.profilePic;
    if (req.file) {
      employee.profilePic = "/employeeProfilePics/" + req.file.filename;
    }
    if (req.file && currentProfilePic) {
      const fileName = currentProfilePic.substring(currentProfilePic.indexOf("/") + 1);
      const fullPath = path.join(__dirname, `../public/employeeProfilePics/${fileName}`);
      try {
        await fs.promises.unlink(fullPath);

      } catch (err) {
        console.log(err);
      }
    }
    await employee.save();
    const responseBody = new ResponseBody("Employee Successfully updated", false, {});
    responseHandler(res, next, responseBody, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
}


exports.getEmployeeProfile = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    const employee = await employeeService.findEmployeeWithFilters(
      { _id: req.query.employeeId },
      { hash: 0 },
      { lean: true }
    );
    let response = new ResponseBody("Employee profile successfully retrived", false, {
      employee,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

