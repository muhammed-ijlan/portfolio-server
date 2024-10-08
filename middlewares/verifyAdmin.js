const mongoose = require("mongoose");
const { jwtService, authService } = require("../services/_index");
const { ErrorBody } = require("../utils/_index");


async function verifyAdmin(req, res, next) {
    try {
        let token = await jwtService.getAuthTokenFromHeader(req);
        if (token) {
            let decoded = await jwtService.verifyAdminToken(token, true);
            if (decoded && decoded.id) {
                let id = mongoose.Types.ObjectId(decoded.id);
                let admin = await authService.findAdminWithFilters(
                    {
                        token: token,
                        _id: id,
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
        throw new ErrorBody(401, "Unauthorized", []);
    } catch (error) {
        console.log(error);
        next(new ErrorBody(401, "Unauthorized", []));
    }
}

module.exports = { verifyAdmin };
