import * as types from '../actions/types'

const initialState = {
    token: localStorage.getItem('token'), //user token
    isAuthenticated: null, // are we auth'd?
    loading: true, //check if loading is done,
    user: null, // user object
}

const auth = (state=initialState, action) => {
    const {type, payload } = action
    switch(type) {
        case types.REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token)
            return {...state, ...payload, isAuthenticated: true, loading: false}
        case types.REGISTER_FAIL:
            // Remove any token that might have existed
            localStorage.removeItem('token')
            return {...state, token: null, isAuthenticated: false, loading: false}
        default:
            return state
    }
}

export default auth