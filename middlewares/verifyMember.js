const { jwtService, authService } = require("../services/_index");
const mongoose = require("mongoose");
const { ErrorBody } = require("../utils/ErrorBody");



const verifyMember = async (req, res, next) => {
    try {
        let token = await jwtService.getAuthTokenFromHeader(req);
        if (!token) {
            throw new ErrorBody();
        }
        let decoded = await jwtService.verifyMemberToken(token);
        if (!decoded || !decoded.id) {
            throw new ErrorBody();
        }
        const member = await authService.findMemberWithFilters({ _id: decoded.id, token: token, isBlocked: false }, "_id accType accessList role", { lean: true });
        if (!member) {
            throw new ErrorBody();
        }
        req.authAccount = {
            _id: member._id,
            accType: member.accType,
            accessList: member.accessList,
        }
        next();
    } catch (error) {
        next(new ErrorBody(401, "Unauthorized", []));
    }
}

module.exports = {
    verifyMember
}