module.exports = (app, express, wagner) => {
    app.use(
        "/api/job-seeker/",
        require("../api/job_seeker.js")(express, wagner)
    );
    app.use("/api/employer", require("../api/employer.js")(express, wagner));
    app.use("/api/login", require("../api/login.js")(express, wagner));
    app.use("/api/service", require("../api/service")(express, wagner));
    app.use(
        "/api/employer-membership-plans",
        require("../api/employer_membership_plan")(express, wagner)
    );
    app.use("/api/job-post", require("../api/job_post")(express, wagner));
    app.use("/api/paypal", require("../api/paypal")(express, wagner));
    // app.use("*", (req, res) => {
    //     res.send(400).send("NO API FOUND");
    // });
};
