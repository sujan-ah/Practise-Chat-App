import * as actiontype from './type'

export function setuser(user){ 
    return { 
        type: actiontype.SET_USER, 
        payload: {
            currentUser: user
        } 
    } 
}