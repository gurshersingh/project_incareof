const validator = require("../utils/middleware/index");
const hash = require('../utils/services/bcrypt')
module.exports = (express, wagner) => {
    const router = express.Router();
    router.post("/check", validator.login, (req, res, next) => {
        const parameters = {
            email: req.body.email,
            password: req.body.password,
        };
        wagner
            .get("LoginManager")
            .checkLogin(parameters)
            .then((result) => {
                if (result.login!==null && result.user !== null) 
                    res.send({ success: true, result });
                else
                    res.status(401).send({
                        success: false,
                        error: "email or password doesn't match",
                    });
            })
            .catch((err) => {
                res.status(401).send({
                    success: false,
                    error: err,
                });
            });
    });
    router.post('/change-password', (req,res,next)=>{
        const params = {
            old_password:req.body.old_password,
            password:hash.generateHash(req.body.new_password),
            id:req.body.user_id
        }
        wagner.get('LoginManager').updatePassword(params)
            .then((result) => {
                if (result) res.send({ success: true, result });
                else
                    res.status(401).send({
                        success: false,
                        error: "user does not exist",
                    });
            })
            .catch((err) => {
                res.status(401).send({
                    success: false,
                    error: err,
                });
            });
    })
    router.get('/verify/:id/:token', (req,res,next)=>{
        const params = {
            id:req.params.id,
            token:req.params.token
        }
        wagner.get('LoginManager').verifyEmail(params)
            .then((response)=>{
                if(response)
                    res.status(200).send('Your account is verified')
                else
                    res.status(401).send('Verification failed. Invalid token')
            })
            .catch((err)=>{
                res.status(401).send('Verification failed. Invalid token')
            })
    })
    router.post('/forget-password', (req,res,next)=>{
        const email = req.body.email
        wagner.get('LoginManager').sendOtp({email})
            .then((response)=>{
                if(response){
                    result = wagner.get('LoginSerializer').serializeUser(response)
                    res.status(200).send({msg:'OTP mailed on registered email address.', result, success:true})
                }
                else
                    res.status(401).send({success:false,msg:'Email address not found.'})
            })
            .catch((err)=>{
                res.status(500).send({success:false,msg:'Unable to handle request.', err})
            })
        
    })
    router.post('/reset-password', (req,res,next)=>{
        const params = {
            password:hash.generateHash(req.body.password),
            otp:req.body.otp,
            id:req.body.id
        }
        wagner.get('LoginManager').resetPassword(params)
            .then((result) => {
                if (result) 
                    res.send({ success: true, result });
                else
                    res.status(401).send({
                        success: false,
                        error: "user does not exist",
                    });
            })
            .catch((err) => {
                res.status(401).send({
                    success: false,
                    error: err,
                });
            });
    })
    return router
}
