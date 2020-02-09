// Since this is index.js, no need to import by file name
import { combineReducers } from 'redux'
import alert from './alert'
import auth from './auth'

export default combineReducers({
    alert: alert,
    auth: auth,
})