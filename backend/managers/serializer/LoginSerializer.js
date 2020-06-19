class LoginSerializer {
    constructor(){

    }
    serializeUser(loginUser){
        return {
            id:loginUser.id,
            email:loginUser.email,
            type:loginUser.type
        }
    }
}
module.exports = LoginSerializer