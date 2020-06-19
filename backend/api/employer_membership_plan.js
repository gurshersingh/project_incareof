module.exports = (express, wagner) => {
    const router = express.Router();
    router.get("/list", (req, res, next) => {
        wagner
            .get("EmployerMembershipPlanManager")
            .getPlans()
            .then((result) => {
                if (result.length > 0) res.send(result);
                else
                    res.status(500).send({
                        message: "No plans found",
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Error occured",
                    success: false,
                    err: err,
                });
            });
    });
    router.post("/select-plan", (req, res, next) => {
        const parameters = {
            membership_type: req.body.membership_type,
            job_post_credit: req.body.job_post_credit,
            candidates_info: req.body.candidates_info,
            price: req.body.price,
            employer_id: req.body.employer_id,
        };
        wagner
            .get("EmployerMembershipPlanManager")
            .selectPlan(parameters)
            .then((result) => {
                if (result) res.send({success: true, result});
                else
                    res.status(500).send({
                        message: "No plans found",
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Error occured",
                    success: false,
                    err: err,
                });
            });
    });
    router.get("/verify/credits/:employer_id", (req, res, next) => {
        const employer_id = req.params.employer_id;
        wagner
            .get("EmployerMembershipPlanManager")
            .checkCredits(employer_id)
            .then((result) => {
                if (!result.isActive)
                    res.status(401).send({success: false, result});
                else {
                    if (!result.credit && !result.candidates_credit)
                        res.status(401).send({success: false, result});
                    else res.status(200).send({success: true, result});
                }
            })
            .catch((err) => {
                res.send(err);
            });
    });
    router.get("/update/employer/credit/:employer_id", (req, res, next) => {
        const employer_id = req.params.employer_id;
        wagner
            .get("EmployerMembershipPlanManager")
            .updateCandidateCreditCount(employer_id)
            .then((result) => {
                if (!result.isActive)
                    res.status(401).send({success: false, result});
                else {
                    if (!result.credits)
                        res.status(401).send({success: false, result});
                    else res.status(200).send({success: true, result});
                }
            });
    });
    return router;
};
