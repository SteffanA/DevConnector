import * as types from './types'
import uuid from 'uuid'

// We need to use dispatch here to properly timeout the alert
export const setAlert = (msg, alertType, timeout=5000) => dispatch => {
    const id = uuid.v4()

    dispatch({
        type: types.SET_ALERT,
        payload: { msg, alertType, id}
    })

    // Timeout our alert after 5 seconds
    setTimeout(() => dispatch(removeAlert(id)), timeout)
}

export const removeAlert = (id) => {
    return ({
        type: types.REMOVE_ALERT,
        payload: id
    })
}