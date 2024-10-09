const multer = require("multer");
const fs = require('fs');
const path = require('path');

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

exports.multerImageUpload = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = path.resolve(__dirname, '..', 'public');

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            cb(null, dir);
        },
        filename: function (req, file, cb) {
            let filename = Date.now() + '-' + file.originalname;
            cb(null, filename);
        }
    });

    return multer({
        storage: storage,
        limits: { fileSize: 20 * 1024 * 1024 }
    });
};


