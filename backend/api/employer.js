const validation = require("../utils/middleware/index");
const hash = require("../utils/services/bcrypt");

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
                type: "EMPLOYER",
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
                title: req.body.title,
                user_id: res.locals.user_id,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                title: req.body.title,
                phone_number: req.body.phone_number,
                company_name: req.body.company_name
                    ? req.body.company_name
                    : null,
            };
            wagner
                .get("EmployerManager")
                .newRegistration(parameters)
                .then((result) => {
                    if (!result.err)
                        res.status(200).send({success: true, result});
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
    // router.post('/add-image', (req, res, next) => {
    //     wagner.get('EmployerManager').addUserImage({
    //         image: req.body.image,
    //         user_id: req.body.user_id
    //     })
    //         .then((result) => {
    //             res.send({ success: true, result })
    //         })
    //         .catch((err) => {

    //             res.send(err)
    //         })

    // })

    router.post("/add-image", upload.single("image"), (req, res, next) => {
        const encode_image = `data:image/png;base64,${req.file.buffer.toString(
            "base64"
        )}`;
        wagner
            .get("EmployerManager")
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
            .get("EmployerManager")
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
    router.post("/post-job", (req, res, next) => {
        const parameters = {
            job_title: req.body.job_title,
            job_description: req.body.job_description,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            wager_offered: req.body.wager_offered,
            job_service_id: req.body.job_service_id,
            employer_id: req.body.user_id,
        };
        wagner
            .get("JobPostManager")
            .createNewJob(parameters)
            .then((result) => {
                if (result !== null) res.send({success: true, result});
                else
                    res.status(401).send({
                        message: "Failed to post job information.",
                        data: err,
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(500).send({success: false, err});
            });
    });
    router.post("/get-jobs", (req, res, next) => {
        const params = {
            employer_id: req.body.employer_id,
        };
        wagner
            .get("JobPostManager")
            .getJobsByEmployer(params)
            .then((result) => {
                if (result.length > 0) res.send({success: true, result});
                else
                    res.status(401).send({
                        message: "Unable to get jobs.",
                        data: null,
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(500).send({success: false, err});
            });
    });
    router.get("/job-applicants/:id", (req, res, next) => {
        const employer_id = req.params.id;
        wagner
            .get("EmployerManager")
            .getApplicants(employer_id)
            .then((result) => {
                if (result.length > 0) res.send({success: true, result});
                else
                    res.status(401).send({
                        message: "No applications found.",
                        data: null,
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(500).send({success: false, err});
            });
    });
    router.post("/starred-candidates", (req, res, next) => {
        const parameters = {
            employer_id: req.body.employer_id,
            job_seeker_id: req.body.job_seeker_id,
        };
        wagner
            .get("StarredSeekerManager")
            .starCandidate(parameters)
            .then((result) => {
                if (result != null) res.send({success: true, result});
                else
                    res.status(401).send({
                        message: "No applications found.",
                        data: null,
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(500).send({success: false, err});
            });
    });
    // Check starred job's response object and employer's home screen api response object
    router.get("/starred/list/:employer_id", (req, res, next) => {
        wagner
            .get("StarredSeekerManager")
            .getListByEmployerId(req.params.employer_id)
            .then((result) => {
                if (result) res.status(200).send({success: true, result});
                else
                    res.status(400).send({
                        success: false,
                        err: "You have no starred candidates.",
                    });
            })
            .catch((err) => {
                res.send(err);
            });
    });
    router.get("/profile/:employer_id", (req, res, next) => {
        const employer_id = req.params.employer_id;
        wagner
            .get("EmployerManager")
            .getEmployer(employer_id)
            .then((result) => {
                if (result) res.status(200).send({success: true, result});
                else
                    res.status(400).send({
                        success: false,
                        err: "You have no starred candidates.",
                    });
            })
            .catch((err) => {
                res.send(err);
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
            .get("EmployerManager")
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
    return router;
};
