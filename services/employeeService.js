const { employeeModel } = require("../models/_index");

exports.findEmployeeWithFilters = async (filters = {}, projections = null, options = {}) => {
  return await employeeModel.findOne(filters, projections, options);
}

exports.getAllEmployees = async (options) => {
  let pipeline = [];
  if (options.fullname) {
    pipeline.push({ $match: { fullname: { $regex: options.fullname, $options: "i" } } });
  }
  if (options.id) {
    pipeline.push({ $match: { _id: options.id } });
  }
  if (options.email) {
    pipeline.push({ $match: { email: options.email } });
  }
  if (options.startDate) {
    pipeline.push({ $match: { createdAt: { $gte: new Date(options.startDate) } } });
  }
  if (options.endDate) {
    pipeline.push({ $match: { createdAt: { $lte: new Date(options.endDate) } } });
  }
  if ([true, false].includes(options.isBlocked)) {
    pipeline.push({ $match: { isBlocked: options.isBlocked } });
  }
  pipeline.push(
    {
      $sort: { _id: -1 },
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],
        data: [{ $skip: options.page * options.size }, { $limit: options.size }],
      },
    },
    {
      $project: {
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
        "data._id": 1,
        "data.fullname": 1,
        "data.email": 1,
        "data.phone": 1,
        "data.isBlocked": 1,
        "data.createdAt": 1,
        "data.updatedAt": 1,
        "data.profilePicture": 1,
        "data.designation": 1,
      },
    }
  );
  return await employeeModel.aggregate(pipeline);
};

// employee
exports.createEmployee = async (reqBody = {}) => {
  try {
    const employee = new employeeModel(reqBody);
    await employee.setHash(reqBody.password);
    return await employee.save();
  } catch (error) {
    return Promise.reject(error);
  }
}

exports.loginEmployee = async (employee) => {
  return {
    token: employee.token,
    employeename: employee.employeename,
    profilePic: employee.profilePic,
  };
};

exports.logoutEmployee = async (id) => {
  return employeeModel.findByIdAndUpdate(id, { $set: { token: `${Math.random()}${Date.now()}Token` } });
}

exports.updateEmployeeWithFilters = async (filters = {}, updateQuery = {}, options = {}) => {
  return await employeeModel.findOneAndUpdate(filters, updateQuery, options);
}