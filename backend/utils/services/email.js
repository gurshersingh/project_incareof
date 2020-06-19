const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'gursher.incareof@gmail.com',
        pass:'uberfornannies'
    }
})
const sendEmail = (toUser, mailOptions) => {

    return new Promise((resolve, reject)=>{
        const mailDetails = {
            from:'gursher.incareof@gmail.com',
            to:toUser.email,
            subject:mailOptions.subject,
            text:mailOptions.text
        }
        transporter.sendMail(mailDetails, function(err, result){
            if(err && !result)
                reject(err)
            else
                resolve(result)
        })
    })
}
module.exports = {sendEmail}