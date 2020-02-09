import * as types from '../actions/types'

const initialState = []

const alert = (state=initialState, action) => {
    console.log("in reducer for alerts in general")
    const { type, payload } = action
    switch(type) {
        // Set a specific alert
        case types.SET_ALERT:
            console.log('Hit our reducer')
            return [...state, payload]
        // Remove an alert by ID
        case types.REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload)
        default:
            return state
    }
}

export default alert