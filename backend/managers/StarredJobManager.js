const Promise = require('bluebird')
class StarredJobManager {
    constructor(wagner) {
        this.wagner = wagner
        this.starred_job = wagner.get('starred_job')
        this.job_seeker = wagner.get('job_seeker')
        this.job_post = wagner.get('job_post')
        this.employer = wagner.get('employer')
    }
    starJob(parameters) {
        return new Promise((resolve, reject)=>{
            // this.starred_job.create({
            //     job_post_id:parameters.job_post_id,
            //     job_seeker_id:parameters.user_id,
            //     status:1
            // })
            // .then((result)=>{
            //     if(result)
            //         resolve(result)
            //     else   
            //         reject(null)
            // })
            // .catch((err)=>{
            //     reject(err)
            // })
            this.starred_job.findOrCreate({
                where:parameters
            })
            .spread((response, created) =>{
                if(created){
                    resolve({is_starred:response.dataValues.status})
                }
                else {
                    this.starred_job.update(
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
    getStarredJobs(user_id){
        return new Promise((resolve, reject)=>{
            this.starred_job.findAll({
                where:{
                    status:1,
                    job_seeker_id:user_id
                },
                include:[
                    {
                        model:this.job_post,
                        as:'job_post',
                        include:[
                            {
                                model:this.employer,
                                as:'employer'
                            }
                        ]
                    }
                ]
            })
            .then((result)=>{
                if(result.length>0)
                    resolve(result)
                else
                    reject(null)
            })
            .catch((err)=>{
                reject(err)
            })
        })
    }
}
module.exports = StarredJobManager
