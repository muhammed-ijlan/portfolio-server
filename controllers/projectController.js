const { validationResult } = require("express-validator");
const { projectService } = require("../services/_index");
const { ResponseBody } = require("../utils/ResponseBody");
const responseHandler = require("../utils/responseHandler");
const path = require('path');
const fs = require("fs");
const { ErrorBody } = require("../utils/ErrorBody");
const { cloudinary } = require('../configs/cloudinaryConfig');

exports.addProject = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }

        let reqBody = req.body;
        let files = req.files;

        if (files && files.length > 0) {
            let uploadPromises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'projects' },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    );
                    stream.end(file.buffer);
                });
            });

            const imageUrls = await Promise.all(uploadPromises);
            reqBody["images"] = imageUrls;
        }

        await projectService.createNewProject(reqBody);

        const response = new ResponseBody("Successfully added Project", false, {});
        responseHandler(res, next, response, 201);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};



exports.getAllProjects = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        let reqQuery = req.query;
        let page = parseInt(reqQuery.page);
        let size = parseInt(reqQuery.size);
        page = isNaN(page) ? 0 : page;
        size = isNaN(size) ? 10 : size;
        let projectName = reqQuery.projectName ? reqQuery.projectName.replace(/\s+/g, " ").split(" ").join(".*") : "";
        let isBlocked = reqQuery.isBlocked || null;
        if (isBlocked && isBlocked === "true") {
            isBlocked = true;
        } else if (isBlocked && isBlocked === "false") {
            isBlocked = false;
        }
        let isPopular = reqQuery.isPopular || null;
        if (isPopular && isPopular === "true") {
            isPopular = true;
        } else if (isPopular && isPopular === "false") {
            isPopular = false;
        }
        let options = {
            page,
            size,
            projectName,
            isBlocked,
            isPopular
        };
        let projects = await projectService.getProjectsWithFilters(options);

        const response = new ResponseBody("Successfully retrieved  projects", false, {
            maxRecords: projects.length ? projects[0].maxRecords : 0,
            projects: projects.length ? projects[0].data : [],
        });
        responseHandler(res, next, response);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};


exports.updateProject = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }

        let reqBody = req.body;
        let projectId = reqBody.projectId;
        let files = req.files;
        let filter = { _id: projectId };

        let project = await projectService.getOneProject(filter);
        if (!project) {
            throw new ErrorBody(400, "Project Not found", []);
        }

        // Handle file upload to Cloudinary
        if (files && files.length > 0) {
            // Upload new files to Cloudinary
            let uploadPromises = files.map((file) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: 'projects' }, // Specify the folder in Cloudinary
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result.secure_url); // Cloudinary URL
                            }
                        }
                    );
                    stream.end(file.buffer); // Upload the file buffer
                });
            });

            const imageUrls = await Promise.all(uploadPromises);
            reqBody["images"] = imageUrls;

            // Delete the old images from Cloudinary
            const deleteCloudinaryImages = async (images) => {
                for (const imageUrl of images) {
                    // Extract the public_id of the image to delete it from Cloudinary
                    const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract public_id from the URL
                    try {
                        await cloudinary.uploader.destroy(`projects/${publicId}`);
                        console.log(`Successfully deleted Cloudinary image: ${publicId}`);
                    } catch (error) {
                        console.error(`Error deleting Cloudinary image: ${publicId}\n`, error);
                    }
                }
            };

            if (project.images && project.images.length > 0) {
                await deleteCloudinaryImages(project.images);
            }
        }

        if (reqBody.projectName) {
            project.projectName = reqBody.projectName;
        }
        if (reqBody.projectLink) {
            project.projectLink = reqBody.projectLink;
        }

        let isPopular = reqBody.isPopular || null;
        if (isPopular && isPopular === "true") {
            project.isPopular = true;
        } else if (isPopular && isPopular === "false") {
            project.isPopular = false;
        }

        let isBlocked = reqBody.isBlocked || null;
        if (isBlocked && isBlocked === "true") {
            project.isBlocked = true;
        } else if (isBlocked && isBlocked === "false") {
            project.isBlocked = false;
        }

        if (reqBody.images) {
            project.images = reqBody.images; // Update with new image URLs
        }

        await project.save();
        const response = new ResponseBody("Successfully updated the project", false, {});
        responseHandler(res, next, response, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};


exports.getOneProject = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        let projectId = req.query.projectId;
        let filter = { _id: projectId };
        let project = await projectService.getOneProject(filter);
        if (!project) {
            throw new ErrorBody(400, "Bad Inputs", []);
        }
        const response = new ResponseBody("Successfully retrieved  project", false, {
            project,
        });
        responseHandler(res, next, response);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};


exports.deleteProject = async (req, res, next) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorBody(400, "Bad Inputs", errors.array());
        }
        let projectId = req.body.projectId;
        let filter = { _id: projectId };
        let project = await projectService.getOneProject(filter);
        const deleteprojectImages = async (images) => {
            for (const imagePath of images) {
                const fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
                const fullPath = path.join(__dirname, `../public/${fileName}`);
                try {
                    await fs.promises.unlink(fullPath);
                    console.log(`Successfully deleted: ${fullPath}`);
                } catch (error) {
                    console.error(`Error deleting file: ${fullPath}\n`, error);
                }
            }
        };
        if (project.images.length) {
            deleteprojectImages(project.images);
        }
        await projectService.deleteBlogPost(filter);
        const response = new ResponseBody("Successfully deleted the blog", false, {});
        responseHandler(res, next, response, 200);
    } catch (error) {
        console.log(error);
        next([400, 401, 403].includes(error.status) ? error : {});
    }
};