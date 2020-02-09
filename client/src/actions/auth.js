import axios from 'axios'
import * as types from './types'
import { setAlert } from './alert'

// Register the user
export const register = ({name, email, password}) => async dispatch => {

    // Config/body might not be required
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password})

    try {
        // Get out token
        const res = await axios.post('/api/users', body, config)

        dispatch({
            type: types.REGISTER_SUCCESS,
            payload: res.data
        })
    } catch (error) {
        // Check if error response contains any 'legible' errors
        const errors = error.response.data.errors
        if (errors) {
            // Set an alert for all errors that came back
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }
        // Start fail reducer
        dispatch({
            type: types.REGISTER_FAIL,
        })
    }
}