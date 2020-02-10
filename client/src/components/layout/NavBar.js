import React, { Fragment } from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as authActions from '../../actions/auth'

export const Navbar = (props) => {
    const {isAuthenticated, loading} = props.auth

    const authLinks = (
        <ul>
            <li>
                <Link to="/dashboard"><i className='fas fa-user' />{' '}
                <span className='hide-sm'>Dashboard</span>
                </Link>
                <Link to="/profiles">Developers</Link>
            </li>
            <li>
                <Link to="/login" onClick={props.logout}>
                    <i className='fas fa-sign-out-alt' />{' '}
                    <span className="hide-sm">Logout</span>
                </Link>
            </li>
        </ul>
    )

    const guestLinks = (
        <ul>
            <li>
                <Link to="/profiles">Developers</Link>
            </li>
            <li>
                <Link to="/register">Register</Link>
            </li>
            <li>
                <Link to="/login">
                    <i className='fas fa-sign-in-alt' />{' '}
                    <span className="hide-sm">Login</span>
                </Link>
            </li>
        </ul>
    )
    return (
        <nav className="navbar bg-dark">
        <h1>
            <Link to="/">
                <i className="fas fa-code"></i> DevConnector
            </Link>
        </h1>
        {!loading && (<Fragment>{isAuthenticated ? authLinks :  guestLinks}</Fragment>)}
        </nav>
    )
}

const mapStateToProps = (state) => { 
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(authActions.logout())
    }
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)