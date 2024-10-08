const multer = require("multer");


exports.multerMemberProfileImageUpload = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/memberProfileImages');
        },
        filename: function (req, file, cb) {
            let filename = Date.now() + file.originalname;
            cb(null, filename)
        }
    });
    const multerDiskUpload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });
    return multerDiskUpload;
}

exports.multerBlogPostImageUpload = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/blogPostImages');
        },
        filename: function (req, file, cb) {
            let filename = Date.now() + file.originalname;
            cb(null, filename)
        }
    });
    const multerDiskUpload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });
    return multerDiskUpload;
}

exports.multerNewsPostImageUpload = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/newsPostImages');
        },
        filename: function (req, file, cb) {
            let filename = Date.now() + file.originalname;
            cb(null, filename)
        }
    });
    const multerDiskUpload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });
    return multerDiskUpload;
}

