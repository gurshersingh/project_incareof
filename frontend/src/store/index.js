import {Provider} from 'react-redux'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import employerRegistrationReducer from '../reducers/EmployerRegistrationReducer';
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'

export default createStore(combineReducers({
    employerRegistrationReducer
}),
{},
applyMiddleware(thunk, promise()))
