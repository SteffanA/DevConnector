import React, { Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import {Link} from 'react-router-dom'
import * as profileActions from '../../actions/profile'

const Dashboard = (props) => {
    const {profile, loading} = props.profile
    const { user } = props.auth
    useEffect(() => {
        props.getCurrentProfile()
    }, [])

    return loading && profile === null ?
        <Spinner /> :
        <Fragment>
            <h1 className='large text-primary'>Dashboard</h1>
            <p className='lead'>
            <i className='fas fa-user'></i> Welcome { user && user.name}
            </p>
            { profile !== null ? 
            <Fragment>has</Fragment>
            :
            <Fragment>
                <p>You have no yet setup a profile. Please add some information about yourself.</p>
                <Link to='/create-profile' className='btn btn-primary my-1' >
                    Create Profile
                </Link>
            </Fragment>
            }
        </Fragment>
}

const mapStateToProps = (state) => {
    return {
        auth: state.auth,
        profile: state.profile,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCurrentProfile: () => dispatch(profileActions.getCurrentProfile())
    }
}


Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
