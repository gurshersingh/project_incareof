const validator = require('./validator')
const employerValidator = (req,res,next) => {
    const validationRule = {
        "first_name":"required|string",
        "last_name":"required|string",
        "phone_number":"required|string",
        "company_name":"string",
        "title":"required:string"
    }
    validator(req.body, validationRule, {}, (err, status)=>{
        if(!status) {
            res.status(412).send({
                message:'Registration Failed',
                data:err,
                success:false
            })
        }
        else
            next()
    })
}
module.exports = employerValidator