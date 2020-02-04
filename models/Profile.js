const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        // map to a User model
        // Use the mongodb auto-generated ID, and ref to user model
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String,
    },
    // Level of skill; senior, jr, etc
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true,
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    // Array of various roles/jobs user has had
    experiece: [
        {
            title: {
                type: String,
                required: true,
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            from: {
                type: Date,
                required: true,
            },
            to: {
                type: Date
            },
            // Is this their current job?
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    education: [
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    // Social media links
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    // Current Date (when created)
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)