module.exports = (express, wagner) => {
    const router = express.Router();
    router.get("/list", (req, res, next) => {
        wagner
            .get("ServiceManager")
            .getAllServices()
            .then((result) => {
                if (result.length > 0) res.send({success: true, result});
                else
                    res.status(500).send({
                        message: "Something went wrong.",
                        error: "500",
                        success: false,
                    });
            })
            .catch((err) => {
                res.status(500).send({
                    message: "Could not load services right now.",
                    success: false,
                    err: err,
                });
            });
    });

    return router;
};
