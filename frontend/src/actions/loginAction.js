import {LOGIN} from '../utilsactionTypes'
import { baseUrl } from '../utils/constants';

export const checkLogin = (data) =>{
    fetch(baseUrl+'api/login/check',{
      method:'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer',
      body:JSON.stringify(this.state)
    })
    .then(response => response.json())
    .then((response)=>{
        return {
            type:LOGIN,
            payload:response
        }
    })
    .catch((err)=>{
        return {
            type:LOGIN,
            payload:err
        }
    })
}