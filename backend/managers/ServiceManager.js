const Promise = require('bluebird')

class ServiceManager {
    constructor(wagner) {
        this.wagner = wagner
        this.service = wagner.get('service')
    }
    getAllServices() {
        return new Promise((resolve, reject)=>{
            this.service.findAll()
                .then((result)=>{
                    if(result.length> 0)
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
module.exports = ServiceManager