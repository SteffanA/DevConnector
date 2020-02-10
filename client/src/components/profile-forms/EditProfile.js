import React, { Fragment , useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as profileActions from '../../actions/profile'

// Wierd deconstruction of profile, but basically:
// profile as a prop is an object, which contains a profile, which is an object containing profile data
// In hindsight, the redux profile maybe should have been renamed
const EditProfile = (props) => {
    const [formData, setFormData] = useState({
        company: '',
        website: '',
        location: '',
        status: '',
        skills: '',
        githubusername: '',
        bio: '',
        twitter: '',
        facebook: '',
        linkedin: '',
        youtube: '',
        instagram: '',
    })

    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    const {
        company,
        website,
        location,
        status,
        skills,
        githubusername,
        bio,
        twitter,
        facebook,
        linkedin,
        youtube,
        instagram
    } = formData

    // Pull out our props
    const {createProfile, history, getCurrentProfile, profile, loading} = props

    useEffect(() => {
        getCurrentProfile()
        // Set form data with profile info
        // For each field; if we're loading or no info, display blank
        // otherwise, display the info
        setFormData({
            company: loading || !profile.company ? '' : profile.company,
            website: loading || !profile.website ? '' : profile.website,
            location: loading || !profile.location ? '' : profile.location ,
            status: loading || !profile.status ? '' : profile.status ,
            skills: loading || !profile.skills ? '' : profile.skills ,
            githubusername: loading || !profile.githubusername ? '' : profile.githubusername ,
            bio: loading || !profile.bio ? '' : profile.bio ,
            twitter: loading || !profile.twitter ? '' : profile.twitter ,
            facebook: loading || !profile.facebook ? '' : profile.facebook ,
            linkedin: loading || !profile.linkedin ? '' : profile.linkedin ,
            youtube: loading || !profile.youtube ? '' : profile.youtube ,
            instagram: loading || !profile.instagram ? '' : profile.instagram ,
        })
    }, [loading]) //update when loading changes

    // Generic method to handle any form changes
    const changeHandler = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: [event.target.value]
        })
    }

    const createOnSubmit = (event) => {
        event.preventDefault()
        console.log(formData)
        createProfile(formData, history, true)
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
        Create Your Profile
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={createOnSubmit}>
        <div className="form-group">
          <select name="status" value={status} onChange={changeHandler}>
            <option value="0">* Select Professional Status</option>
            <option value="Developer">Developer</option>
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Manager">Manager</option>
            <option value="Student or Learning">Student or Learning</option>
            <option value="Instructor">Instructor or Teacher</option>
            <option value="Intern">Intern</option>
            <option value="Other">Other</option>
          </select>
          <small className="form-text"
            >Give us an idea of where you are at in your career</small
          >
        </div>
        <div className="form-group">
          <input type="text" placeholder="Company" name="company" value={company} onChange={changeHandler}/>
          <small className="form-text"
            >Could be your own company or one you work for</small
          >
        </div>
        <div className="form-group">
          <input type="text" placeholder="Website" name="website" value={website} onChange={changeHandler}/>
          <small className="form-text"
            >Could be your own or a company website</small
          >
        </div>
        <div className="form-group">
          <input type="text" placeholder="Location" name="location" value={location} onChange={changeHandler}/>
          <small className="form-text"
            >City & state suggested (eg. Boston, MA)</small
          >
        </div>
        <div className="form-group">
          <input type="text" placeholder="* Skills" name="skills" value={skills} onChange={changeHandler}/>
          <small className="form-text"
            >Please use comma separated values (eg.
            HTML,CSS,JavaScript,PHP)</small
          >
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Github Username"
            name="githubusername"
            value={githubusername} onChange={changeHandler}
          />
          <small className="form-text"
            >If you want your latest repos and a Github link, include your
            username</small
          >
        </div>
        <div className="form-group">
          <textarea placeholder="A short bio of yourself" name="bio" value={bio} onChange={changeHandler}></textarea>
          <small className="form-text">Tell us a little about yourself</small>
        </div>

        <div className="my-2">
          <button onClick={() => toggleSocialInputs(!displaySocialInputs)} type="button" className="btn btn-light">
            {!displaySocialInputs ? 'View Social Network Links' : 'Hide Social Network Links'}
          </button>
          <span>Optional</span>
        </div>

        {/* Only show social media inputs when toggled. */}
        { displaySocialInputs && <Fragment>
                <div className="form-group social-input">
                <i className="fab fa-twitter fa-2x"></i>
                <input type="text" placeholder="Twitter URL" name="twitter" value={twitter} onChange={changeHandler}/>
                </div>

                <div className="form-group social-input">
                <i className="fab fa-facebook fa-2x"></i>
                <input type="text" placeholder="Facebook URL" name="facebook" value={facebook} onChange={changeHandler}/>
                </div>

                <div className="form-group social-input">
                <i className="fab fa-youtube fa-2x"></i>
                <input type="text" placeholder="YouTube URL" name="youtube" value={youtube} onChange={changeHandler}/>
                </div>

                <div className="form-group social-input">
                <i className="fab fa-linkedin fa-2x"></i>
                <input type="text" placeholder="Linkedin URL" name="linkedin" value={linkedin} onChange={changeHandler}/>
                </div>

                <div className="form-group social-input">
                <i className="fab fa-instagram fa-2x"></i>
                <input type="text" placeholder="Instagram URL" name="instagram" value={instagram} onChange={changeHandler}/>
                </div>
            </Fragment>}

        <input type="submit" className="btn btn-primary my-1" />
        <a className="btn btn-light my-1" href="dashboard.html">Go Back</a>
      </form>
        </Fragment>
    )
}

EditProfile.propTypes = {
    createProfile : PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
    return {
        profile: state.profile.profile,
        loading: state.profile.loading,
    }
}

const mapPropsToDispatch = (dispatch) => {
    return {
        createProfile: (formData, history, edit) => dispatch(profileActions.createProfile(formData, history, edit)),
        getCurrentProfile: () => dispatch(profileActions.getCurrentProfile()),
    }
}

export default connect(mapStateToProps, mapPropsToDispatch)(EditProfile)