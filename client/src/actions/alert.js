import * as types from './types'
import uuid from 'uuid'

export const setAlert = (msg, alertType) => dispatch => {
    const id = uuid.v4()
    dispatch({
        type: setAlert,
        payload: { msg, alertType, id}
    })
}

export const removeAlert = () => {

}