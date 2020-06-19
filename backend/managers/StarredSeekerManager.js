const Promise = require('bluebird')

class StarredSeekerManager {
    constructor(wagner){
        this.starred_seeker = wagner.get('starred_seeker')
        this.job_seeker = wagner.get('job_seeker')
    }
    getListByEmployerId(empId) {
        return new Promise((resolve,reject)=>{
            this.starred_seeker.findAll({
                where:{
                    employer_id:empId,
                    status:1
                },
                include:[
                    {
                        model:this.job_seeker,
                        as:'job_seeker'
                    }
                ]
            })
            .then((result)=>{
                if(result.length >0)
                    resolve(result)
                else
                    resolve(null)
            })
            .catch(err => reject(err))
        })
    }
    starCandidate(parameters){
        return new Promise((resolve, reject)=>{
            this.starred_seeker.findOrCreate({
                where:parameters
            })
            .spread((response, created) =>{
                if(created){
                    resolve({is_starred:response.dataValues.status})
                }
                else {
                    this.starred_seeker.update(
                        {
                            status:!response.dataValues.status
                        },
                        {
                            where:parameters
                        }
                    )
                    .then((result)=>{
                        if(result.length >=0 && result[0] == 1)
                            resolve({is_starred:!response.dataValues.status})
                    })
                    .catch(err => reject(err))
                }
            })
        })
    }
}
module.exports = StarredSeekerManager