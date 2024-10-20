const { enquiryModel, jobQueueModel } = require("../models/_index");
const excel = require("exceljs");
const path = require("path");

exports.addNewEnquiry = async (data) => {
  return await enquiryModel.create(data);
};

exports.getAllEnquiries = async (options) => {
  let pipeline = [];
  if (options.name) {
    pipeline.push({ $match: { name: { $regex: options.name, $options: "i" } } });
  }
  if (options.email) {
    pipeline.push({ $match: { email: options.email } });
  }

  if (options.subject) {
    pipeline.push({ $match: { subject: { $regex: options.subject, $options: "i" } } });
  }


  pipeline.push(
    {
      $sort: { _id: -1 },
    },
    {
      $facet: {
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],
        data: [{ $skip: options.page * options.size }, { $limit: options.size }],
      },
    },
    {
      $project: {
        maxRecords: { $ifNull: [{ $arrayElemAt: ["$metadata.total", 0] }, 0] },
        data: 1,
      },
    }
  );
  return await enquiryModel.aggregate(pipeline);
};


exports.getAnEnquiry = async (id) => {
  return await enquiryModel.findOne({ _id: id });
}


// FOR EXOPORT MODULE
// exports.exportEnquiry = async (filename, options, id) => {
//   try {
//     let pipeline = [];
//     if (options.name) {
//       pipeline.push({ $match: { name: { $regex: options.name, $options: "i" } } });
//     }
//     if (options.email) {
//       pipeline.push({ $match: { email: options.email } });
//     }
//     if (options.startDate) {
//       pipeline.push({ $match: { createdAt: { $gte: new Date(options.startDate) } } });
//     }
//     if (options.endDate) {
//       pipeline.push({ $match: { createdAt: { $lte: new Date(options.endDate) } } });
//     }
//     if (options.phone) {
//       pipeline.push({ $match: { phone: options.phone } });
//     }
//     if (options.organisation) {
//       pipeline.push({ $match: { organisation: { $regex: options.organisation, $options: "i" } } });
//     }
//     if (options.service) {
//       pipeline.push({
//         $match: {
//           "services.name": options.service,
//         },
//       });
//     }

//     pipeline.push({
//       $sort: { _id: -1 },
//     });
//     const enquiryList = await enquiryModel.aggregate(pipeline);
//     if (!enquiryList.length) {
//       throw "No Enquiries Found";
//     }
//     let workbook = new excel.Workbook();
//     let worksheet = workbook.addWorksheet("Enquiries");

//     worksheet.columns = [
//       { header: "Date", key: "createdAt", width: 12 },
//       { header: "Name", key: "name", width: 20 },
//       { header: "Email", key: "email", width: 30 },
//       { header: "Phone", key: "phone", width: 12 },
//       { header: "Organisation", key: "organisation", width: 30 },
//       { header: "Services For", key: "servicesFor", width: 12 },
//       { header: "Services", key: "services", width: 60 },
//       { header: "Message", key: "message", width: 60 },
//     ];

//     enquiryList.forEach((enquiry, index) => {
//       let row = worksheet.getRow(index + 2);
//       row.getCell(1).value = enquiry.createdAt;
//       row.getCell(2).value = enquiry.name;
//       row.getCell(3).value = enquiry.email;
//       row.getCell(4).value = enquiry.phone;
//       row.getCell(5).value = enquiry.organisation;
//       row.getCell(6).value = enquiry.servicesFor;
//       let servicesCellValue = "";
//       enquiry.services.forEach((service, serviceIndex) => {
//         servicesCellValue += `${service.name.replaceAll("_", " ")} (${service.serviceType.join(", ")})`;
//         if (serviceIndex < enquiry.services.length - 1) {
//           servicesCellValue += ", ";
//         }
//       });
//       row.getCell(7).value = servicesCellValue;
//       row.getCell(8).value = enquiry.message;
//     });


//     let filePath = path.join(path.dirname(__dirname), "files", filename);
//     await workbook.xlsx.writeFile(filePath).then(() => {
//       console.log("FILE SAVED!");
//     });
//     const jobQueueData = { status: "COMPLETED", metadata: { filePath } };
//     await jobQueueModel.findByIdAndUpdate(id, jobQueueData);
//   } catch (error) {
//     console.log(error);
//     const jobQueueData = { status: "FAILED" };
//     await jobQueueModel.findByIdAndUpdate(id, jobQueueData);
//   }
// };
