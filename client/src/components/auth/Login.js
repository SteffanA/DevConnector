import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'

export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    // Deconstruct form data
    const {email, password} = formData

    // Generic onChange handler for our form
    //uses the 'name' field of the input to determine which field to update in our state
    const changeHandler = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    // Remember, needs to be async b/c we need to do DB stuff
    const submitHandler = async (event) => {
        event.preventDefault()
        if (!password) {
            // Don't submit, set alert
            console.log('No pwd match')
        }
        else {
            console.log('success')
        }
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" onSubmit={submitHandler}>
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
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/login">Register</Link>
            </p>
        </Fragment>
    )
}

export default Login