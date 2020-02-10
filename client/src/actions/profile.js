import axios from 'axios'
import { setAlert } from './alert'

import * as types from './types'

// Get current user profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me')

        dispatch({
            type: types.GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: types.PROFILE_ERROR,
            payload: {
                msg: error.response.status.text,
                status: error.response.status
            }
        })
    }
}