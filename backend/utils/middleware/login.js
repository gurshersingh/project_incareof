const validator = require("./validator");
const loginDataValidation = (req, res, next) => {
    const validationRules = {
        email: "required|email",
        password: "required|string|min:6",
    };
    validator(req.body, validationRules, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                message: "Login Failed",
                data: err,
                success: false,
            });
        } else next();
    });
};
module.exports = loginDataValidation;
