const verifyAdmin = require("./verifyAdmin");
const verifySuperAdmin = require("./verifySuperAdmin");
const verifyMember = require("./verifyMember");
const verifyFileDownload = require("./verifyFileDownload");

module.exports = {
  verifyAdmin,
  verifySuperAdmin,
  verifyFileDownload,
  verifyMember
};
