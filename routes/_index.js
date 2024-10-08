module.exports = (app) => {
  app.use("/", require("./welcomeRouter"));
  app.use("/test", require("./testRouter"));
  app.use("/member", require("./memberRouter"));
  app.use("/auth", require("./authRouter"));
  // app.use("/configuration", require("./configurationRouter"));
  app.use("/employee", require("./employeeRouter"));
  app.use("/enquiry", require("./enquiryRouter"));
  app.use("/queue", require("./jobQueueRouter"));
  app.use("/download", require("./fileDownloadRouter"));
  app.use("/blog", require("./blogPostRouter"));
  app.use("/blog-category", require("./blogCategoryRouter"));
  app.use("/news-category", require("./newsCategoryRouter"));
  app.use("/news", require("./newsPostRouter"));
  app.use("/enquiry-source", require("./enquirySourceRouter"));
  app.use("/enquiry-status", require("./enquiryStatusRouter"));
  app.use("/enquiry-category", require("./enquiryCategoryRouter"));

};
