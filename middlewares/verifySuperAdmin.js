const services = require("../services/_index");
const mongoose = require("mongoose");
const utils = require("../utils/_index");

async function verifySuperAdmin(req, res, next) {
  try {
    let token = await services.jwtService.getAuthTokenFromHeader(req);
    if (token) {
      let decoded = await services.jwtService.verifyAdminToken(token, true);
      if (decoded && decoded.id) {
        let id = mongoose.Types.ObjectId(decoded.id);
        let admin = await services.authService.findAdminWithFilters(
          {
            token: token,
            _id: id,
            accType:"SUPER_ADMIN"
          },
          "_id accType",
          { lean: true }
        );
        if (admin) {
          req.admin = admin;
          return next();
        }
      }
    }
    throw new utils.ErrorBody(401, "Unauthorized", []);
  } catch (error) {
    console.log(error);
    next(new utils.ErrorBody(401, "Unauthorized", []));
  }
}

module.exports = { verifySuperAdmin };
