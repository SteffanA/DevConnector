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

// Create or update profile
export const createProfile = (formData, history, edit=false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // Post updated form data to our DB
        const res = await axios.post('/api/profile', formData, config)

        // Dispatch profile, same as above
        dispatch({
            type: types.GET_PROFILE,
            payload: res.data
        })

        // Set an alert stating profile was updated or created, depending on context
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

        // If we're editing, stay on page. If we're creating, redirect
        if (!edit) {
            history.push('/dashboard')
        }
    } catch (error) {
        const errors = error.response.data.errors

        if ( errors ) {
            errors.forEach(err => dispatch(setAlert(err.msg, 'danger')))
        }

        dispatch({
            type: types.PROFILE_ERROR,
            payload: {
                msg: error.response.status.text,
                status: error.response.status
            }
        })

    }
}