const jwt = require("jsonwebtoken");
const utils = require("../utils/_index");

/////////////// Admin ////////////////

exports.createAdminToken = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let token = jwt.sign({ id: id }, process.env.ADMIN_TOKEN_JWT_SECRET, {
        expiresIn: "10 days",
      });
      return resolve(token);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.verifyAdminToken = (token, ignoreExpiration = false) => {
  return new Promise((resolve, reject) => {
    try {
      let decoded = jwt.verify(token, process.env.ADMIN_TOKEN_JWT_SECRET, {
        ignoreExpiration: ignoreExpiration,
      });
      return resolve(decoded);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.createFileDownloadToken = (filename) => {
  return new Promise((resolve, reject) => {
    try {
      let token = jwt.sign({ filename: filename }, process.env.FILE_DOWNLOAD_TOKEN_JWT_SECRET, {
        expiresIn: 30 * 60,
      });
      return resolve(token);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.verifyFileDownloadToken = (token, ignoreExpiration = false) => {
  return new Promise((resolve, reject) => {
    try {
      let decoded = jwt.verify(token, process.env.FILE_DOWNLOAD_TOKEN_JWT_SECRET, {
        ignoreExpiration: ignoreExpiration,
      });
      return resolve(decoded);
    } catch (error) {
      return reject(error);
    }
  });
};



//USER


exports.createUserJWT = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let token = jwt.sign({ id: id }, process.env.USER_TOKEN_JWT_SECRET, {
        expiresIn: "10 days",
      });
      return resolve(token);
    } catch (error) {
      return reject(error);
    }
  });
}

exports.verifyUserJWT = (token, ignoreExpiration = true) => {
  return new Promise((resolve, reject) => {
    try {
      let decoded = jwt.verify(token, process.env.USER_TOKEN_JWT_SECRET, {
        ignoreExpiration: ignoreExpiration,
      });
      return resolve(decoded);
    } catch (error) {
      return reject(error);
    }
  });
}


exports.adminCreateResetPasswordLink = (id) => {
  return new Promise((resolve, reject) => {
    try {
      let token = jwt.sign({ id: id }, process.env.ADMIN_RESET_PASSWORD_JWT_SECRET, {
        expiresIn: 5 * 60,
      });
      return resolve(`${process.env.ADMIN_APP_URL}/reset-pass?token=${token}`);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.adminVerifyResetPasswordLink = (token) => {
  return new Promise((resolve, reject) => {
    try {
      let decoded = jwt.verify(token, process.env.ADMIN_RESET_PASSWORD_JWT_SECRET, {
        ignoreExpiration: false,
      });
      return resolve(decoded);
    } catch (error) {
      return reject(error);
    }
  });
};


/////////////// End Admin ///////////////

exports.getAuthTokenFromHeader = async (req) => {
  try {
    const {
      headers: { authorization },
    } = req;
    if (authorization && authorization.split(" ")[0] === "Bearer") {
      return authorization.split(" ")[1];
    } else {
      throw new utils.ErrorBody(401, "Unauthorized", []);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
