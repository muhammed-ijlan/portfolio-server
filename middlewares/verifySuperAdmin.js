const services = require("../services/_index");
const mongoose = require("mongoose");
const utils = require("../utils/_index");

async function verifySuperAdmin(req, res, next) {
  try {
    const token = await services.jwtService.getAuthTokenFromHeader(req);

    if (!token) {
      throw new utils.ErrorBody(401, "No token provided", []);
    }

    const decoded = await services.jwtService.verifyAdminToken(token, true);
    if (!decoded || !decoded.id) {
      throw new utils.ErrorBody(401, "Invalid token", []);
    }

    const admin = await services.authService.findAdminWithFilters(
      { _id: mongoose.Types.ObjectId(decoded.id), token: token },
      "_id",
      { lean: true }
    );

    if (!admin) {
      throw new utils.ErrorBody(401, "Admin not found or token mismatch", []);
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error(error.message);
    next(new utils.ErrorBody(401, "Unauthorized", []));
  }
}

module.exports = { verifySuperAdmin };
