import axios from 'axios'

// Set the axios headers if a token exists, otherwise remove it.
const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token
    }
    else{
        delete axios.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken