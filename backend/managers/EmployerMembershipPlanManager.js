const Promise = require("bluebird");

class EmployerMembershipPlanManager {
    constructor(wagner) {
        this.wagner = wagner;
        this.employer_membership_plans = wagner.get(
            "employer_membership_plans"
        );
    }
    getPlans() {
        return new Promise((resolve, reject) => {
            this.employer_membership_plans
                .findAll()
                .then((result) => {
                    if (result.length > 0) resolve(result);
                    else reject(null);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    selectPlan(parameters) {
        return new Promise((resolve, reject) => {
            this.employer_membership_plans
                .findOrCreate({
                    where: {
                        employer_id: parameters.employer_id,
                        active: 1,
                    },
                    defaults: {...parameters},
                })
                .spread((plan, created) => {
                    if (created) resolve(plan);
                    else reject({msg: "Employer has an active plan", plan});
                })
                .catch((err) => reject(err));
        });
    }
    checkPlanValidity(id) {
        return new Promise((resolve, reject) => {
            this.employer_membership_plans
                .findOne({
                    where: {
                        employer_id: id,
                        active: 1,
                    },
                })
                .then((plan) => {
                    if (!plan) {
                        resolve({isActive: false, credit: false});
                    } else {
                        if (plan.job_post_credit <= 0)
                            resolve({credit: false, isActive: true});
                        else {
                            this.employer_membership_plans
                                .update(
                                    {
                                        job_post_credit:
                                            plan.job_post_credit - 1,
                                    },
                                    {
                                        where: {
                                            id: plan.id,
                                        },
                                    }
                                )
                                .then((update) => {
                                    if (update.length > 0 && update[0] == 1)
                                        resolve({isActive: true, credit: true});
                                    else {
                                        reject("Unable to post right now.");
                                    }
                                })
                                .catch((err) => reject(err));
                        }
                    }
                })
                .catch((err) => reject(err));
        });
    }
    checkCredits(employer_id) {
        return new Promise((resolve, reject) => {
            this.employer_membership_plans
                .findOne({
                    where: {
                        employer_id,
                        active: 1,
                    },
                })
                .then((plan) => {
                    const response = {
                        isActive: true,
                        job_credit: true,
                        candidates_credit: true,
                    };
                    if (!plan) {
                        response.isActive = response.job_credit = response.candidates_credit = false;
                        resolve(response);
                    } else {
                        if (plan.job_post_credit <= 0)
                            response.job_credit = false;
                        if (plan.candidates_info <= 0)
                            response.candidates_credit = false;
                        resolve(response);
                    }
                })
                .catch((err) => reject(err));
        });
    }
    updateCandidateCreditCount(employer_id) {
        return new Promise((resolve, reject) => {
            this.employer_membership_plans
                .findOne({
                    where: {
                        employer_id,
                        active: 1,
                    },
                })
                .then((plan) => {
                    if (!plan) resolve({isActive: false, credits: false});
                    else {
                        if (plan.candidates_info <= 0)
                            resolve({isActive: true, credits: false});
                        else {
                            this.employer_membership_plans
                                .update(
                                    {
                                        candidates_info:
                                            plan.candidates_info - 1,
                                    },
                                    {
                                        where: {
                                            id: plan.id,
                                        },
                                    }
                                )
                                .then((update) => {
                                    if (update.length > 0 && update[0] == 1)
                                        resolve({
                                            isActive: true,
                                            credits: true,
                                        });
                                    else reject("Unable to update");
                                });
                        }
                    }
                })
                .catch((err) => reject(err));
        });
    }
}
module.exports = EmployerMembershipPlanManager;
