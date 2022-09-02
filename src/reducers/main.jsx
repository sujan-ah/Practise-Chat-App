import * as actiontype from '../actions/type'
import { combineReducers } from "redux";

const initialState = {
    currentUser: null,
    isLoading: true,
}
function user_reducer(state = initialState, action) {
    switch (action.type) {
            case actiontype.SET_USER:
            return {
                currentUser: action.payload.currentUser,
                isLoading: false,
            }
            case actiontype.CLEAR_USER:
            return {
                ...initialState
            }
        default:
        return state
    }
}


const initialStateGroup = {
    currentGroup: null,
}
function group_reducer(state = initialStateGroup, action) {
    switch (action.type) {
            case actiontype.SET_USER:
            return {
                currentGroup: action.payload.currentGroup,
            }
        default:
        return state
    }
}

const rootreducer = combineReducers({
    user: user_reducer,
    group: group_reducer,
});

export default rootreducer;