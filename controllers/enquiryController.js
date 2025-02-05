const { validationResult } = require("express-validator");
const { ErrorBody, ResponseBody, responseHandler } = require("../utils/_index");
const { enquiryService } = require("../services/_index");
const { default: mongoose } = require("mongoose");

exports.addNewEnquiry = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqBody = req.body;
    await enquiryService.addNewEnquiry(reqBody);
    let response = new ResponseBody("Enquiry Successfully Added", false, {});
    responseHandler(res, next, response, 200);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getAllEnquiries = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorBody(400, "Bad Inputs", errors.array());
    }
    let reqQuery = req.query;
    let page = parseInt(req.query.page) || 0;
    let size = parseInt(req.query.size) || 10;
    page = isNaN(page) ? 0 : page;
    size = isNaN(size) ? 10 : size;
    let name = reqQuery.name ? reqQuery.name.replace(/\s+/g, " ").split(" ").join(".*") : "";
    let email = reqQuery.email ? reqQuery.email : null;
    let subject = reqQuery.subject ? reqQuery.subject.replace(/\s+/g, " ").split(" ").join(".*") : "";
    const options = {
      page: page,
      size: size,
      name,
      email,
      subject,
    };
    const result = await enquiryService.getAllEnquiries(options);
    let response = new ResponseBody("Enquiries successfully retrived", false, {
      records: result.length ? result[0].data : [],
      maxRecords: result.length ? result[0].maxRecords || 0 : 0,
    });
    responseHandler(res, next, response);
  } catch (error) {
    console.log(error);
    next([400, 401, 403].includes(error.status) ? error : {});
  }
};

exports.getOneEnquiry = async (req, res, next) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      throw new ErrorBody(400, "Invalid Id Provided", validationErrors.array());
    };
    const id = req.query.id;
    if (!mongoose.isValidObjectId(id)) {
      throw new ErrorBody(400, "Invalid Object ID provided", []);
    }
    const result = await enquiryService.getAnEnquiry(id);
    let response = new ResponseBody("Enquiry has been fetched", false, result);
    return responseHandler(res, next, response)
  } catch (e) {
    console.log(e);
    next([400, 401, 403].includes(e.status) ? e : {})
  }
}


// EXPORT MODULE TO Excell file

// exports.exportEnquiries = async (req, res, next) => {
//   try {
//     let errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       throw new ErrorBody(400, "Bad Inputs", errors.array());
//     }
//     const jobQueueData = {
//       name: "ENQUIRY_EXPORT",
//       status: "IN_PROGRESS",
//     };
//     const jobQueDoc = await jobQueueService.createJob(jobQueueData);
//     const enquiryExport = async (id) => {
//       let reqBody = req.body;
//       let name = reqBody.name ? reqBody.name.replace(/\s+/g, " ").split(" ").join(".*") : "";
//       let email = reqBody.email ? reqBody.email : null;
//       let startDate = reqBody.startDate ? new Date(reqBody.startDate) : null;
//       let endDate = reqBody.endDate ? new Date(reqBody.endDate) : null;
//       let phone = reqBody.phone ? reqBody.phone : null;
//       let serviceFor = reqBody.serviceFor ? reqBody.serviceFor : null;
//       let service = reqBody.service ? reqBody.service : null;
//       let organisation = reqBody.organisation ? reqBody.organisation.replace(/\s+/g, " ").split(" ").join(".*") : "";
//       const options = {
//         name,
//         email,
//         startDate,
//         endDate,
//         phone,
//         serviceFor,
//         service,
//         organisation,
//       };
//       let filename = `enquiryExport/${Date.now()}.xlsx`;
//       await enquiryService.exportEnquiry(filename, options, id);
//     };
//     setTimeout(() => {
//       enquiryExport(jobQueDoc._id);
//     }, 1000);
//     let response = new ResponseBody("Enquiry Export Job Successfully Added", false, {});
//     responseHandler(res, next, response, 200);
//   } catch (error) {
//     console.log(error);
//     next([400, 401, 403].includes(error.status) ? error : {});
//   }
// };
