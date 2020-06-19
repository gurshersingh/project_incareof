const { resolve } = require("bluebird")
const { reject } = require("async")


class EmployerPaymentManager {
    constructor(wagner) {
        this.wagner = wagner
        this.employer_payment = wagner.get('employer_payment')
    }
    getTransaction(transaction_token){
        return new Promise((resolve, reject)=>{
            this.employer_payment.findOne({
                where:{
                    transaction_token:transaction_token
                }
            })
            .then((transaction)=> {
                if(transaction!==null)
                    resolve(transaction)
                else
                    reject(null)
            })
            .catch(err => reject(err))
        })
    }
    createNewTransaction(parameters) {
        return new Promise((resolve, reject) => {
            console.log('inside manager function')
            const transaction = {
                membership_id:parameters.membership_id,
                employer_id:parameters.employer_id,
                transaction_id:parameters.transaction_id,
                transaction_token:parameters.transaction_token,
                price:parameters.price
            }

            this.employer_payment.create(transaction)
                .then((result)=>{
                    if(result !== null) {
                        resolve(result)
                    }
                    else {
                        reject(null)
                    }
                })
                .catch((err) => {
                    console.log(err)
                    reject(err)
                })
        })
    }
    updatePayment(parameters){
        return new Promise((resolve, reject)=> {
            this.getTransaction(parameters.transaction_token)
            .then((transaction)=> {
                if(transaction !== null){
                    this.employer_payment.update(
                        {
                            transaction_status:parameters.status,
                            transaction_id:parameters.transaction_id
                        },
                        {
                            where:{
                                id:transaction.id
                            }
                        }
                    ).then((result)=>{
                        if(result.length > 0 && result[0]==1)
                            resolve(result)
                        else
                            reject(null)
                    })
                }
                else
                    reject(null)
            })
            .catch(err => reject(err))

        })

    }

}
module.exports = EmployerPaymentManager