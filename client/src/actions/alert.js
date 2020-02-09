import * as types from './types'
import uuid from 'uuid'

export const setAlert = (msg, alertType) => dispatch => {
    console.log('in set alert')
    const id = uuid.v4()
    return({
        type: types.SET_ALERT,
        payload: { msg, alertType, id}
    })
}

export const removeAlert = () => {

}