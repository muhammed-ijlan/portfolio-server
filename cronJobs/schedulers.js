const cron = require('node-cron');
const jobs = require("./jobs");
const chalk = require("chalk");


// Every sunday at 00:00:00
cron.schedule("0 0 0 * *  0", async () => {
  try {
    await jobs.deleteEnquiryExcelExport();
  } catch (error) {
    console.log(error);
  }
});