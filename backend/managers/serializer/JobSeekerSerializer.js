class JobSeekerSerializer {
    constructor(){

    }
    serializeUser(seeker){
        return user = {
            id:seeker.id,
            first_name:seeker.first_name,
            last_name:seeker.last_name,
            image:seeker.image
        }
    }
}
module.exports = JobSeekerSerializer