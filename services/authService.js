const { adminModel, } = require("../models/_index");

// Admin

exports.createAdmin = async (reqBody = {}) => {
    try {
        const admin = new adminModel(reqBody);
        await admin.setHash(reqBody.password);
        return await admin.save();
    } catch (error) {
        return Promise.reject(error);
    }
}

exports.loginMember = async (admin) => {
    return {
        token: admin.token,
        fullname: admin.fullname,
        email: admin.email,
        accType: admin.accType,
        profilePic: admin.profilePic,
    };
};

exports.logoutMember = async (id) => {
    return adminModel.findByIdAndUpdate(id, { $set: { token: `${Math.random()}${Date.now()}Token` } });
}

exports.findAdminWithFilters = async (filters = {}, projections = null, options = {}) => {
    return await adminModel.findOne(filters, projections, options);
}



