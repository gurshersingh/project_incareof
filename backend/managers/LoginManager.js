const Promise = require("bluebird");
const bcrypt = require("bcryptjs");
const { uuid } = require('uuidv4')
const {sendEmail} = require('../utils/services/email.js')
const otp = require('otp')()
class LoginManager {
    constructor(wagner) {
        this.wagner = wagner;
        this.login = wagner.get("login");
        this.employer = wagner.get('employer')
        this.job_seeker = wagner.get('job_seeker')
        this.user_token = wagner.get('user_token')
        this.forget_password = wagner.get('forget_password')
    }
    updatePassword(params) {
        return new Promise((resolve, reject)=>{
            this.login.findOne({
                where:{
                    id:params.id
                }
            })
            .then((result)=>{
                if(result){
                    if(!bcrypt.compareSync(params.old_password,result.password)) {
                        reject('old password does not match')
                    }
                    else
                         return this.login.update(
                            {
                                password:params.password
                            },
                            {
                            where:{ id:params.id}
                            }
                        )
                }
                else{
                    reject('User not found')}
            })
            .then((result)=>{
                resolve(result)
            })
            .catch((err)=>{
                reject(err)
            })
        })
    }
    checkLogin(parameters){
        return new Promise((resolve, reject)=>{
            const query = {
                where: {
                    email: parameters.email,
                },
            };
            this.login.findOne(query)
                .then((result) => {
                    if (!result) reject("Email does not exist");
                    else {
                        if (bcrypt.compareSync(parameters.password,result.password)) {
                            // serialize the object before sending the result
                            if(result.type== 'EMPLOYER') {
                                this.employer.findOne({where:{user_id:result.id}})
                                    .then((user) => {
                                        if(user !==null)
                                            resolve({user, login:result})
                                        else
                                            reject('no user found')
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    });

                            }
                            else if(result.type == 'JOB_SEEKER'){
                                this.job_seeker.findOne({where:{user_id:result.id}})
                                    .then((user) => {
                                        if(user !==null)
                                            resolve({user, login:result})
                                        else
                                            reject('no user found')
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    });
                            }
                        }
                        else 
                            reject("Incorrect email/password");
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    createNewUser(parameters) {
        return new Promise((resolve, reject) => {
            const query = {
                where: {
                    email: parameters.email,
                },
                defaults: {
                    email: parameters.email,
                    password: parameters.password,
                    type: parameters.type,
                },
            };
            this.login
                .findOrCreate(query)
                .spread((result, created) => {
                    if (created){
                      // Serialize the object before returning to the frontend
                        this.user_token.create({
                            login_id:result.id,
                            token:uuid()
                        })
                        .then((token)=>{
                            const mailOptions = {
                                subject:"verify your email account",
                                text:`Click on the following link to verify your account: http://localhost:2000/api/login/verify/${result.id}/${token.token}`
                            }
                            sendEmail(result, mailOptions)
                            resolve(result)
                        })
                    }
                    else reject("Email Already Exist");
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    verifyEmail(params) {
        return new Promise((resolve, reject)=>{
            this.login.findByPk(params.id)
                .then((user)=>{
                    if(user){
                        this.user_token.findOne({
                            where:{
                                login_id:params.id,
                                token:params.token
                            }
                        })
                        .then((verify)=>{
                            if(!verify)
                                reject('Invalid token')
                            else {
                                return this.login.update(
                                    {
                                        verified_email:1
                                    },
                                    {
                                        where:{
                                            id:user.id
                                        }
                                    }
                                )
                                .then((update)=>{
                                    if(update.length >0 && update[0] == 1)
                                        resolve(update)
                                    else
                                        reject(null)
                                })
                                .catch(err => reject(err))
                            }
                        })
                    }
                    else
                        reject('No user found')
                })
                .catch(err => reject(err))
        })
    }
    sendOtp(user) {
        return new Promise((resolve, reject)=>{
            this.login.findOne({
                where:{
                    email:user.email
                }
            })
            .then((loggedIn)=>{
                if(!loggedIn) {
                    reject('No user found.')
                }
                else {
                    const user_otp = otp.totp()
                    this.forget_password.create({
                        otp:user_otp,
                        login_id:loggedIn.id
                    })
                    .then((recovery) => {
                        const mailOptions = {
                            subject: 'Password recovery OTP',
                            text:`Your OTP to change your password is: ${recovery.otp}`
                        }
                        sendEmail(loggedIn, mailOptions)
                        resolve(loggedIn)
                    })
                }
            })
            .catch(err => reject(err))
        })
    }
    resetPassword(params){
        return new Promise((resolve, reject)=>{
            this.forget_password.findOne({
                where:{
                    login_id:params.id,
                    otp:params.otp,
                    is_valid:0
                }
            })
            .then((recovery)=>{
                if(!recovery){
                    reject('Incorrect OTP')
                }
                else {
                    this.forget_password.update(
                        {
                            is_valid:1
                        },
                        {
                            where:{
                                id:recovery.dataValues.id
                            }
                        }
                    )
                    .then((result)=>{
                        if(result.length >0 && result[0] == 1){
                            this.login.update(
                                {
                                    password:params.password
                                },
                                {
                                    where:{
                                        id:params.id
                                    }
                                }
                            )
                            .then((result)=>{
                                if(result.length >0 && result[0] == 1)
                                    resolve(result)
                                else
                                    reject(null)
                            })
                        }
                        else
                            reject(null)
                    })
                }
            })
        })
    }
}
module.exports = LoginManager;
