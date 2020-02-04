const express = require('express')
const router = express.Router()
const auth  = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route GET api/profile/me
// @desc Get current user profile based on token
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        // Get the user based on the linked user in profile model
        // Bring in the Profile's user object, name, and avatar
        const profile = await Profile.findOne({ user: req.user.id })
            .populate('user', ['name', 'avatar'])

        // Check if a profile was returned
        if (!profile) {
            return res.status(400).json({msg: 'There is no profile for this user'})
        }
        // Otherwise a Profile exists, return it
        return res.json(profile)
    } catch (err) {
        console.err(err.message)
        return res.status(500).send('Server Error')
    }
})


// @route POST api/profile
// @desc Get current user profile based on token
// @access Private
router.post('/', [
    auth,
    [
        check('status', 'Status is required').not().isEmpty(),
        check('skills', 'Skills is required').not().isEmpty()
    ]
],
async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // Parse out the fields from the Profile
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    // Build our Profile object
    const profileFields = {}
    profileFields.user = req.user.id // known by token
    // Validate that the fields we deconstructed above actually exist
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    // Skills is an array
    if (skills) {
        // Get skills by comma-delimiter, then trim resulting array's elements
        // such that there are no trailing spaces
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    }
    // Build our array of social media sites
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (facebook) profileFields.social.facebook = facebook
    if (twitter) profileFields.social.twitter = twitter
    if (instagram) profileFields.social.instagram = instagram
    if (linkedin) profileFields.social.linkedin = linkedin

    // Insert our data into the DB
    try {
        let profile = await Profile.findOne({ user: req.user.id })

        if (profile) {
            // Update the profile
            profile = await Profile.findOneAndUpdate({ user: req.user.id},
                { $set: profileFields},
                {new: true}
            )
            return res.json(profile)
        }

        // If not found, create the profile

        profile = new Profile(profileFields)
        await profile.save()

        return res.json(profile)
    }
    catch (err){
        console.error(err.message)
        return res.status(500).send('Server Error')
    }
})


// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        // Get all name and avatars for all Users from their Profile
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        return res.json(profiles)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server Error')
    }
})


// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        // Get a single user profile based on their user ID
        const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found. '})
        }

        return res.json(profile)
    } catch (error) {
        console.error(error.message)
        // Check to see if we errored out because of a bad user ID, not a bad connection etc
        if (error.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found. '})
        }
        return res.status(500).send('Server Error')
    }
})

module.exports = router