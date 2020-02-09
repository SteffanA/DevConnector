import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Alert = ({ alerts }) => (
    // Check if we have any alerts
    // For each alert, create a div with CSS related to the type
    // Implicitly return our alerts
    alerts !== null && alerts.length > 0 && alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg }   
        </div>
    ))
)

const mapStateToProps = (props) => ({
    alerts: props.alert,
})

Alert.propTypes = {
    alerts: PropTypes.array.isRequired,
}

export default connect(mapStateToProps, null)(Alert)
