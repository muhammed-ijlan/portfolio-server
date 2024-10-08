const { memberModel } = require("../models/_index");


exports.addMember = async (reqBody = {}) => {
  try {
    const member = new memberModel(reqBody);
    await member.setHash(reqBody.password);
    return await member.save();
  } catch (error) {
    return Promise.reject(error);
  }
};



exports.findMemberWithFilters = async (filters = {}, projections = null, options = {}) => {
  return await memberModel.findOne(filters, projections, options);
};

exports.updateMemberWithFilters = async (filters = {}, updateQuery = {}, options = {}) => {
  return await memberModel.findOneAndUpdate(filters, updateQuery, options);
};

exports.getEmployees = async (options = {}) => {
  let pipeline = [];
  if (options.id) {
    pipeline.push(
      {
        $match: {
          _id: options.id
        }
      }
    );
  }
  if (options.fullname) {
    pipeline.push(
      {
        $match: {
          fullname: { $regex: options.fullname, $options: "i" }
        }
      }
    );
  }
  if (options.email) {
    pipeline.push(
      {
        $match: {
          email: { $regex: options.email, $options: "i" }
        }
      }
    );
  }
  if ([true, false].includes(options.isBlocked)) {
    pipeline.push(
      {
        $match: {
          isBlocked: options.isBlocked
        }
      }
    );
  }

  pipeline.push(
    {
      $match: {
        accType: {
          $in: ["ENQUIRY_MANAGER", "TELE_CALLER"]
        }
      }
    },
    {
      $sort: { _id: -1 }
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 }
            }
          }
        ],
        data: [
          { $skip: options.page * options.size },
          {
            $limit: options.size
          },
          {
            $project: {
              fullname: 1,
              email: 1,
              accType: 1,
              role: 1,
              isBlocked: 1,
              profilePic: 1,
            }
          }
        ]
      }
    },
    {
      $project: {
        data: 1,
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] }
      }
    }
  );
  return await memberModel.aggregate(pipeline);
};



exports.getSubAdmins = async (options = {}) => {
  let pipeline = [];
  pipeline.push(
    {
      $match: {
        accType: "SUB_ADMIN"
      }
    },
    {
      $sort: { _id: -1 }
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 }
            }
          }
        ],
        data: [
          { $skip: options.page * options.size },
          {
            $limit: options.size
          },
          {
            $project: {
              fullname: 1,
              email: 1,
              accType: 1,
              role: 1,
              isBlocked: 1,
              profilePic: 1,
            }
          }
        ]
      }
    },
    {
      $project: {
        data: 1,
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] }
      }
    }
  );
  return await memberModel.aggregate(pipeline);
};


exports.getTelecallers = async (options) => {
  let pipeline = [];
  if (options.fullname) {
    pipeline.push(
      {
        $match: {
          fullname: { $regex: options.fullname, $options: "i" }
        }
      }
    );
  }
  if (options.email) {
    pipeline.push(
      {
        $match: {
          email: options.email
        }
      }
    );
  }
  if ([true, false].includes(options.isBlocked)) {
    pipeline.push(
      {
        $match: {
          isBlocked: options.isBlocked
        }
      }
    );
  }
  if (options.id) {
    pipeline.push(
      {
        $match: {
          _id: options.id
        }
      }
    );
  }
  if (options.ids) {
    pipeline.push(
      {
        $match: {
          "_id": { $in: options.ids }
        }
      }
    );
  }
  pipeline.push(
    {
      $match: {
        "role.name": { $in: ["TELE_CALLER"] }
      }
    },
    {
      $sort: { "_id": -1 }
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 }
            }
          }
        ],
        data: [
          { $skip: options.page * options.size },
          {
            $limit: options.size
          },
          {
            $project: {
              _id: 1,
              fullname: 1,
              email: 1,
              accType: 1,
              createdAt: 1,
              isBlocked: 1,
              profilePic: 1,
            }
          }
        ]
      }
    },
    {
      $project: {
        data: 1,
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] }
      }
    }
  );
  return await memberModel.aggregate(pipeline);
};



exports.getLeadManagers = async (options) => {
  let pipeline = [];
  if (options.fullname) {
    pipeline.push(
      {
        $match: {
          fullname: { $regex: options.fullname, $options: "i" }
        }
      }
    );
  }
  if (options.email) {
    pipeline.push(
      {
        $match: {
          email: options.email
        }
      }
    );
  }
  if ([true, false].includes(options.isBlocked)) {
    pipeline.push(
      {
        $match: {
          isBlocked: options.isBlocked
        }
      }
    );
  }
  if (options.id) {
    pipeline.push(
      {
        $match: {
          _id: options.id
        }
      }
    );
  }


  pipeline.push(
    {
      $match: {
        "role.name": { $in: ["LEAD_MANAGER"] }
      }
    },
    {
      $sort: { "_id": -1 }
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 }
            }
          }
        ],
        data: [
          { $skip: options.page * options.size },
          {
            $limit: options.size
          },
          {
            $project: {
              _id: 1,
              fullname: 1,
              email: 1,
              accType: 1,
              createdAt: 1,
              isBlocked: 1,
              profilePic: 1,
            }
          }
        ]
      }
    },
    {
      $project: {
        data: 1,
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] }
      }
    }
  );
  return await memberModel.aggregate(pipeline);
};


exports.getLeadManagerList = async () => {
  return await memberModel.find({ "role.name": { $in: ["LEAD_MANAGER"] }, isBlocked: false }, { fullname: 1, email: 1, _id: 1 }).sort({ fullname: 1 });
};

exports.getLeadManagerForFilter = async () => {
  return await memberModel.find({ "role.name": { $in: ["LEAD_MANAGER"] } }, { fullname: 1, email: 1, _id: 1 }).sort({ fullname: 1 });
};


exports.getTelecallerForFilter = async (options) => {
  let pipeline = [];
  if (options.managerId) {
    if (options.ids) {
      pipeline.push(
        {
          $match: {
            "_id": { $in: options.ids }
          }
        }
      );
    } else {
      return [];
    }
  }
  pipeline.push(
    {
      $match: {
        "role.name": { $in: ["TELE_CALLER"] }
      }
    },
    {
      $sort: { "_id": -1 }
    },
    {
      $project: {
        _id: 1,
        fullname: 1,
        email: 1,
      }
    }
  );
  return await memberModel.aggregate(pipeline);
};
