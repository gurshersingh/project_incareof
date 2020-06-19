import {LOGIN} from '../utils/actionTypes'
const INITIAL_STATE = {
    err:null,
    sucess:'',
    user_id:'',
    user_type:'',
    first_name:'',
    last_name:'',
    isLoading:false

}
const employerRegistrationReducer = (state=INITIAL_STATE, action)  =>{
    switch(action.type){
        case LOGIN+"_FULFILLED":
            return {
                ...state,
                user_id:action.payload.user_id,
                user_type:action.payload.user_type,
                first_name:action.payload.first_name,
                last_name:action.payload.last_name,
                success:true,
                isLoading:false
            }
            break
        case LOGIN+"_REJECTED":
                return {
                    ...state,
                    err:action.payload.err,
                    success:false,
                    isLoading:false
                }
                break
        case LOGIN+"_PENDING":
            return {
                ...state,
                isLoading:true
            }
        default:
            return state
    }
}
export default employerRegistrationReducer
