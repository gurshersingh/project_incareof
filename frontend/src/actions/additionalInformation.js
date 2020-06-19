import {GET_SERVICES} from '../utils/actionTypes'

import { baseUrl } from '../utils/constants';
export const getServices = () => {
    fetch(baseUrl+'api/service/list',{
        method:'GET',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer',
    })
    .then(response => response.json())
    .then((response)=>{
        return {
            payload:response,
            type: GET_SERVICES
        }
    })
    .catch((err)=>{
        return {
            payload:err,
            type: GET_SERVICES
        }
    })
}

