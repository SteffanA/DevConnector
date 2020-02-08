import * as types from './types'
import uuid from 'uuid'

export const setAlert = (msg, alertType) => dispatch => {
    console.log('in set alert')
    const id = uuid.v4()
    dispatch({
        type: setAlert,
        payload: { msg, alertType, id}
    }
    )
    console.log('post dispatch')
}

export const removeAlert = () => {

}