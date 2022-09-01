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
                type: action.payload.currentUser,
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

const rootreducer = combineReducers({
    user: user_reducer,
});

export default rootreducer;