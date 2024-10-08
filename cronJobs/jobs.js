const chalk = require('chalk');
const moment = require("moment");
const fs = require("fs");
const { jobQueueService } = require("../services/_index");



exports.deleteEnquiryExcelExport = async () => {
  try {
    console.log(chalk.blue("START DELETING USER EXCEL DOCS JOB"));
    const jobs = await jobQueueService.getExportEnquiryByDate();
    if (jobs.length) {
      const jobId = [];
      const filePath = [];
      jobs.forEach((job) => {
        jobId.push(job._id);
        if (job.metadata?.filePath) {
          filePath.push(job.metadata.filePath);
        }
      });
      await Promise.all(
        filePath.map((item) => {
          fs.unlink(item, (error) => {
            if (error) console.log(error);
            else console.log("deleted file", item);
          });
        })
      );
      await jobQueueService.removePath(jobId);
    }
    console.log(chalk.blue("END DELETING USER EXCEL DOCS JOB"));
  } catch (error) {
    console.log(error);
  }
};
