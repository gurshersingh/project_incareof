const Promise = require("bluebird");

class JobSeekerManager {
    constructor(wagner) {
        this.wagner = wagner;
        this.job_seeker = wagner.get("job_seeker");
        this.login = wagner.get("login");
        this.job_post = wagner.get("job_post");
    }
    newRegistration(seeker) {
        return new Promise((resolve, reject) => {
            this.wagner
                .get("job_seeker")
                .findOrCreate({
                    where: {
                        user_id: seeker.user_id,
                    },
                    defaults: seeker,
                })
                .spread((result, created) => {
                    if (created) resolve(result);
                    else resolve({err: "email already exist"});
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    addUserImage(parameter) {
        const that = this;
        return new Promise((resolve, reject) => {
            this.job_seeker
                .update(
                    {
                        image: parameter.image,
                    },
                    {
                        where: {
                            id: parameter.id,
                        },
                    }
                )
                .then((result) => {
                    if (result.length == 1 && result[0] != 0) {
                        return that.job_seeker.findByPk(parameter.id);
                    } else reject("Unable to add your image. No user Found.");
                })
                .catch((err) => {
                    reject(err);
                })
                .then((result) => {
                    resolve(result);
                });
        });
    }
    addUserCity(parameters) {
        return new Promise((resolve, reject) => {
            this.job_seeker
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
                        return this.job_seeker.findByPk(parameters.id);
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
    getUserProfile(user_id) {
        return new Promise((resolve, reject) => {
            this.job_seeker
                .findOne({
                    where: {
                        user_id,
                    },
                })
                .then((result) => {
                    if (result != null) resolve(result);
                    else reject(null);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    editProfile(job_seeker, id) {
        return new Promise((resolve, reject) => {
            this.job_seeker
                .update(
                    {
                        ...job_seeker,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                )
                .then((result) => {
                    if (result.length == 1 && result[0] != 0)
                        return this.job_seeker.findByPk(id);
                    else reject("Unable to update profile. No user found.");
                })
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    applyToJob(parameters) {
        return new Promise((resolve, reject) => {
            wagner
                .get("apply_jobs")
                .create({
                    jobSeekerId: parameters.job_seeker_id,
                    jobPostId: parameters.job_post_id,
                })
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}
module.exports = JobSeekerManager;
