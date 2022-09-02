import * as actiontype from './type'

export function setuser(user){ 
    return { 
        type: actiontype.SET_USER, 
        payload: {
            currentUser: user
        } 
    } 
}
export function clearuser(){ 
    return { 
        type: actiontype.CLEAR_USER,
    } 
}

export function setgroup(group){ 
    return { 
        type: actiontype.SET_CURRENT_GROUP, 
        payload: {
            currentGroup: group
        } 
    } 
}