// const { space, spaceName } =
//   require("../configs/_index").digitalOceanSpace;
// const { ErrorBody } = require("../utils/_index");

// const multer = require("multer");
// const multers3 = require("multer-s3");

// //File Upload - public

// const publicFileUpload = multer({
//   storage: multers3({
//     s3: space,
//     bucket: spaceName,
//     acl: "public-read",
//     key: (req, file, cb) => {
//       let filename = `public/${Date.now()}${file.originalname}`;
//       cb(null, filename);
//     },
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname, mimeType: file.mimetype });
//     },
//   }),
// });

// //File upload - private

// const privateFileUpload = multer({
//   storage: multers3({
//     s3: space,
//     bucket: spaceName,
//     acl: "private",
//     key: (req, file, cb) => {
//       let filename = `private/${Date.now()}${file.originalname}`;
//       cb(null, filename);
//     },
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname, mimeType: file.mimetype });
//     },
//   }),
//   limits: {
//     fileSize: 1 * 1024 * 1024,
//   },
// });




// // Read File from space

// function readFileFromSpace(fileName) {
//   let params = {
//     Bucket: spaceName,
//     Key: fileName,
//   };
//   return new Promise((resolve, reject) => {
//     space.getObject(params, (err, data) => {
//       if (err) return reject(err);
//       else return resolve(data);
//     });
//   });
// }

// // Create signedURL for private files

// function createSignedURL(fileName, contentType = null, signedUrlExpireSeconds = 10 * 60) {
//   let params = {
//     Bucket: spaceName,
//     Key: fileName,
//     Expires: signedUrlExpireSeconds,
//   };
//   if (contentType) {
//     params["ResponseContentType"] = contentType;
//   }
//   return new Promise((resolve, reject) => {
//     space.getSignedUrl("getObject", params, (err, url) => {
//       if (err) return reject(err);
//       else return resolve(url);
//     });
//   });
// }

// function deleteFileFromSpace(fileName) {
//   let params = {
//     Bucket: spaceName,
//     Key: fileName,
//   };
//   return new Promise((resolve, reject) => {
//     space.deleteObject(params, (err, url) => {
//       if (err) return reject(err);
//       else return resolve(url);
//     });
//   });
// }

// async function deleteFilesFromSpace(files = []) {
//   let deletePromises = files.map((file) => {
//     return deleteFileFromSpace(file);
//   });
//   try {
//     await Promise.all(deletePromises);
//   } catch (error) {
//     //fine
//   }
// }

// async function getContentType(fileName = "") {
//   try {
//     let type = fileName.split('.').pop();
//     var contentType = '';
//     switch (type) {
//       case 'gif': contentType = 'image/gif'; break;
//       case 'png': contentType = 'image/png'; break;
//       case 'svg': contentType = 'image/svg+hml'; break;
//       case 'pdf': contentType = 'application/pdf'; break;
//       case 'mp3': contentType = 'audio/mpeg'; break;
//       case 'mp4': contentType = 'video/mp4'; break;
//       case 'mpeg': contentType = 'video/mpeg'; break;
//       case 'odt': contentType = 'application/vnd.oasis.opendocument.text'; break;
//       case 'ppt': contentType = 'application/vnd.ms-powerpoint'; break;
//       case 'pptx': contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'; break;
//       case 'xls': contentType = 'application/vnd.ms-excel'; break;
//       case 'xlsx': contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; break;
//       case 'xml': contentType = 'application/xml'; break;

//       default: contentType = 'image/jpeg';
//     }
//     return contentType;
//   } catch (error) {
//     return Promise.reject(error);
//   }
// }

// module.exports = {
//   publicFileUpload,
//   privateFileUpload,
//   readFileFromSpace,
//   createSignedURL,
//   deleteFileFromSpace,
//   deleteFilesFromSpace,
//   getContentType
// };
