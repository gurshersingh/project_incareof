const Promise = require("bluebird");

class JobPostManager {
    constructor(wagner) {
        this.wagner = wagner;
        this.job_post = wagner.get("job_post");
        this.employer = wagner.get("employer");
        this.job_seeker = wagner.get("job_seeker");
        this.service = wagner.get("service");
        this.EmployerMembershipPlanManager = wagner.get(
            "EmployerMembershipPlanManager"
        );
    }
    createNewJob(parameters) {
        return new Promise((resolve, reject) => {
            this.EmployerMembershipPlanManager.checkPlanValidity(
                parameters.employer_id
            )
                .then((result) => {
                    if (!result.isActive) {
                        reject("Buy a membership plan");
                    } else if (result.isActive && !result.credit)
                        reject("Job Post credits expired");
                    else {
                        this.job_post
                            .create(parameters)
                            .then((result) => {
                                if (result != null) resolve(result);
                                else reject(null);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    }
                })
                .catch((err) => reject(err));
        });
    }
    findAll() {
        return new Promise((resolve, reject) => {
            this.job_post
                .findAll({
                    where: {
                        selected_user: null,
                    },
                    include: [
                        {
                            model: this.employer,
                            as: "employer",
                            attributes: [
                                "first_name",
                                "last_name",
                                "phone_number",
                                "company_name",
                                "id",
                                "image",
                            ],
                        },
                        {
                            model: this.service,
                            as: "service",
                            attributes: ["service_name"],
                        },
                    ],
                })
                .then((result) => {
                    if (result) resolve(result);
                    else reject(null);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getJobsByEmployer(params) {
        return new Promise((resolve, reject) => {
            this.job_post
                .findAll({
                    where: {
                        employer_id: params.employer_id,
                    },
                })
                .then((result) => {
                    if (result) resolve(result);
                    else reject(null);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}

module.exports = JobPostManager;
