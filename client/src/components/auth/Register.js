import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as alertActions from '../../actions/alert'
import * as authActions from '../../actions/auth'
import PropTypes from 'prop-types'

export const Register = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    })

    // Deconstruct form data
    const { name, email, password, password2} = formData

    // Generic onChange handler for our form
    //uses the 'name' field of the input to determine which field to update in our state
    const changeHandler = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    // Remember, needs to be async b/c we need to do DB stuff
    const submitHandler = async (event) => {
        event.preventDefault()
        if (password !== password2) {
            // Don't submit, set alert
            props.setAlert('Passwords do not match.', 'danger')
        }
        else {
            props.register({name, email, password})
        }
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={submitHandler}>
                <div className="form-group">
                <input type="text" placeholder="Name" name="name" 
                onChange={changeHandler}
                required />
                </div>
                <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" onChange={changeHandler}/>
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                >
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    minLength="6"
                    onChange={changeHandler}
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    onChange={changeHandler}
                    minLength="6"
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}


const mapDispatchToProps = (dispatch) => {
    return {
        setAlert: (msg, alertType) => dispatch(alertActions.setAlert(msg, alertType)),
        register: (credentials) => dispatch(authActions.register(credentials)),
    }
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
}

export default connect(null, mapDispatchToProps)(Register)