module.exports = (express, wagner) =>{
    const router = express.Router()
    router.get('/list', (req,res,next)=>{
        wagner.get('JobPostManager').findAll()
            .then((result)=>{
                if(result.length>0)
                    res.send({
                        success:true,
                        result:result
                    })
                else
                    res.send({
                        success:false,
                        result:null
                    })
            })
            .catch((err)=>{
                res.status(500).send({success:false,err})
            })
    })
    return router;
}