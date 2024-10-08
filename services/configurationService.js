const { configurationModel } = require("../models/_index");

exports.updateConfiguration = async (update = {}) => {
  return await configurationModel.findOneAndUpdate({}, update);
};

exports.getConfigurations = async (projext) => {
  return await configurationModel.findOne({}, projext);
};
