const validation = require("../utils/middleware/index");
const hash = require("../utils/services/bcrypt");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const upload = multer();
module.exports = (express, wagner) => {
    const router = express.Router();
    router.post(
        "/registration",
        validation.login,
        (req, res, next) => {
            const parameters = {
                email: req.body.email,
                password: hash.generateHash(req.body.password),
                type: "JOB_SEEKER",
            };
            wagner
                .get("LoginManager")
                .createNewUser(parameters)
                .then((result) => {
                    if (result) {
                        res.locals.user_id = result.id;
                        next();
                    } else
                        res.status(500).send({
                            message: "Something Went Wrong",
                            success: false,
                            err: "Something Went Wrong",
                        });
                })
                .catch((err) => {
                    res.status(403).send({
                        message: err,
                        success: false,
                        err: err,
                    });
                });
        },
        (req, res, next) => {
            const parameters = {
                user_id: res.locals.user_id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                title: req.body.title,
                phone_number: req.body.phone_number,
                company_name: req.body.company_name,
            };
            wagner
                .get("JobSeekerManager")
                .newRegistration(parameters)
                .then((result) => {
                    if (!result.err)
                        res.status(200).send({
                            success: true,
                            result,
                        });
                    else
                        res.status(412).send({
                            message: "Registration Failed",
                            success: false,
                            err: result.err,
                        });
                })
                .catch((err) => {
                    res.status(412).send({
                        message: "Registration Failed",
                        data: err,
                        success: false,
                    });
                });
        }
    );

    // add image to the database
    // Request body -> 1. user_id 2, image in base64 format
    router.post("/add-image", upload.single("image"), (req, res, next) => {
        const encode_image = `data:image/png;base64,${req.file.buffer.toString(
            "base64"
        )}`;
        wagner
            .get("JobSeekerManager")
            .addUserImage({image: encode_image, id: req.body.id})
            .then((result) => {
                res.send({success: true, result});
            })
            .catch((err) => {
                res.send(err);
            });
    });

    // add user's city and and services to the database.
    // Request body -> 1. user_id 2. city 3. services
    router.post("/add-ctiy-services", (req, res, next) => {
        const parameters = {
            city: req.body.city,
            services: req.body.services,
            id: req.body.id,
        };
        wagner
            .get("JobSeekerManager")
            .addUserCity(parameters)
            .then((result) => {
                if (result !== null) res.send({success: true, result});
                else
                    res.status(401).send({
                        message: "Failed to update information.",
                        data: err,
                        success: false,
                    });
            });
    });

    router.get("/profile/:id", (req, res, next) => {
        const job_seeker_id = req.params.id;
        wagner
            .get("JobSeekerManager")
            .getUserProfile(job_seeker_id)
            .then((result) => {
                if (result != null)
                    res.status(200).send({success: true, result});
                else
                    res.status(401).send({
                        message: "Unable to load profile",
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(412).send({
                    message: "unable to load profile",
                    data: err,
                    success: false,
                });
            });
    });

    router.post("/profile/edit", upload.single("image"), (req, res, next) => {
        let encode_image = null;
        if (req.file) {
            encode_image = `data:image/png;base64,${req.file.buffer.toString(
                "base64"
            )}`;
        }
        let parameters = null;

        if (encode_image) {
            parameters = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                title: req.body.title,
                phone_number: req.body.phone_number,
                city: req.body.city,
                company_name: req.body.company_name,
                image: encode_image,
            };
        } else {
            parameters = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                title: req.body.title,
                phone_number: req.body.phone_number,
                city: req.body.city,
                company_name: req.body.company_name,
            };
        }
        wagner
            .get("JobSeekerManager")
            .editProfile(parameters, req.body.id)
            .then((result) => {
                if (result != null)
                    res.status(200).send({success: true, result});
                else
                    res.status(401).send({
                        message: "Unable to load profile",
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(412).send({
                    message: "unable to load profile",
                    data: err,
                    success: false,
                });
            });
    });
    router.post("/star-job/add", (req, res, next) => {
        const parameters = {
            job_seeker_id: req.body.user_id,
            job_post_id: req.body.job_post_id,
        };
        wagner
            .get("StarredJobManager")
            .starJob(parameters)
            .then((result) => {
                if (result != null)
                    res.status(200).send({success: true, result});
                else
                    res.status(401).send({
                        message: "Unable to load profile",
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(412).send({
                    message: "unable to load profile",
                    data: err,
                    success: false,
                });
            });
    });
    router.get("/starred-job/list/:id", (req, res, next) => {
        const user_id = req.params.id;
        wagner
            .get("StarredJobManager")
            .getStarredJobs(user_id)
            .then((result) => {
                if (result != null)
                    res.status(200).send({success: true, result});
                else
                    res.status(401).send({
                        message: "Unable to load profile",
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(412).send({
                    message: "unable to load profile",
                    data: err,
                    success: false,
                });
            });
    });
    router.post("/apply-job", (req, res, next) => {
        const params = {
            job_post_id: req.body.job_post_id,
            job_seeker_id: req.body.user_id,
        };
        wagner
            .get("JobSeekerManager")
            .applyToJob(params)
            .then((result) => {
                if (result) res.status(200).send({success: true});
                else
                    res.status(400).send({
                        success: false,
                        err: "Unable to apply at the moment",
                    });
            })
            .catch((err) => {
                res.send(err);
            });
    });

    return router;
};
