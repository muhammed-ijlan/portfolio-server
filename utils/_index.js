const { ErrorBody } = require("./ErrorBody");
const { ResponseBody } = require("./ResponseBody");
const responseHandler = require("./responseHandler");
const emailTemplates = require("./emailTemplates");

module.exports = {
  ErrorBody,
  ResponseBody,
  responseHandler,
  emailTemplates,
};
