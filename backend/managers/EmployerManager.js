const Promise = require("bluebird");
class EmployerManager {
    constructor(wagner) {
        this.wagner = wagner;
        this.employer = wagner.get("employer");
        this.job_post = wagner.get("job_post");
        this.apply_jobs = wagner.get("apply_jobs");
        this.job_seeker = wagner.get("job_seeker");
    }
    newRegistration(parameters) {
        return new Promise((resolve, reject) => {
            this.employer
                .findOrCreate({
                    where: {
                        user_id: parameters.user_id,
                    },
                    defaults: parameters,
                })
                .spread((result, created) => {
                    if (created) resolve(result);
                    else reject("Company already registered");
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    addUserImage(parameters) {
        return new Promise((resolve, reject) => {
            this.employer
                .update(
                    {
                        image: parameters.image,
                    },
                    {
                        where: {
                            id: parameters.id,
                        },
                    }
                )
                .then((result) => {
                    if (result.length == 1 && result[0] != 0)
                        return this.employer.findByPk(parameters.id);
                    else reject("Unable to add image. No user found.");
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    addUserCity(parameters) {
        return new Promise((resolve, reject) => {
            this.employer
                .update(
                    {
                        city: parameters.city,
                    },
                    {
                        where: {
                            id: parameters.id,
                        },
                    }
                )
                .then((result) => {
                    if (result.length == 1 && result[0] != 0)
                        return this.employer.findByPk(parameters.id);
                    else reject("Unable to add city. No user found.");
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    getApplicants(employer_id) {
        return new Promise((resolve, reject) => {
            // get all jobs posted by employer
            // include all applicants for those jobs
            this.job_post
                .findAll({
                    where: {
                        employer_id,
                    },
                    include: [
                        {
                            model: this.job_seeker,
                        },
                    ],
                })
                .then((result) => resolve(result))
                .catch((err) => reject(err));
        });
    }

    getEmployer(empId) {
        return new Promise((resolve, reject) => {
            this.employer
                .findByPk(empId)
                .then((response) => {
                    if (response) resolve(response);
                    else reject(null);
                })
                .catch((err) => reject(err));
        });
    }
    editProfile(parameters, id) {
        return new Promise((resolve, reject) => {
            this.employer
                .findOne({where: {id}})
                .then((user) => {
                    if (user) {
                        this.employer
                            .update(
                                {
                                    ...parameters,
                                },
                                {
                                    where: {
                                        id: user.id,
                                    },
                                }
                            )
                            .then((result) => {
                                if (result.length > 0 && result[0] == 1) {
                                    this.employer
                                        .findByPk(id)
                                        .then((response) => resolve(response));
                                } else reject("unable to update");
                            });
                    } else reject("Employer not found.");
                })
                .catch((err) => reject(err));
        });
    }
}
module.exports = EmployerManager;
