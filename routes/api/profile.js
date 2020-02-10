const express = require('express')
const router = express.Router()
const auth  = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const request = require('request')
// Load enviromental variables from our .env file
const dotenv = require('dotenv')
dotenv.config()

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
    if (status) profileFields.status = status.toString()
    if (githubusername) profileFields.githubusername = githubusername
    // Skills is an array
    if (skills) {
        // Get skills by comma-delimiter, then trim resulting array's elements
        // such that there are no trailing spaces
        profileFields.skills = skills.toString().split(',').map(skill => skill.trim())
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


// @route DELETE api/profile
// @desc Delete profile, user and posts
// @access Private
router.delete('/', auth, async (req, res) => {
    try {
        //TODO - remove posts
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id})
        // Remove the User
        await User.findOneAndRemove({ _id: req.user.id })

        return res.json({ msg: 'User and data deleted'} )
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server Error')
    }
})


// @route PUT api/profile/experience
// @desc Add profile experience
// @access Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Failed a validation check
        return res.status(400).json({ errors: errors.array()})
    }

    // Parse out info from the request
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    // Assign said info so that we can hold the new experience info
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id})

        //unshift pushes to beginning rather than the end
        // Recognize that the experience is simply an array of 'experiences'
        // We choose to put the newer (by addition) first, we can always alter
        // order based on a param in the front end
        profile.experience.unshift(newExp)

        await profile.save()

        return res.json(profile)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server Error')
    }
})

// @route DELETE api/profile/experience
// @desc Delete an experience from profile
// @access Private
router.delete('/experience/:exp_id', [auth], async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id})

        // Get remove index
        const index = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        profile.experience.splice(index, 1)

        await profile.save()

        return res.json(profile)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server Error')
    }
})

// @route PUT api/profile/education
// @desc Add profile education
// @access Private
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of study is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Failed a validation check
        return res.status(400).json({ errors: errors.array()})
    }

    // Parse out info from the request
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body

    // Assign said info so that we can hold the new experience info
    const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id})

        //unshift pushes to beginning rather than the end
        // Recognize that the education is simply an array of 'educations'
        // We choose to put the newer (by addition) first, we can always alter
        // order based on a param in the front end
        profile.education.unshift(newEdu)

        await profile.save()

        return res.json(profile)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server Error')
    }
})

// @route DELETE api/profile/education
// @desc Delete an education from profile
// @access Private
router.delete('/education/:edu_id', [auth], async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id})

        // Get remove index
        const index = profile.education.map(item => item.id).indexOf(req.params.exp_id)

        profile.education.splice(index, 1)

        await profile.save()

        return res.json(profile)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send('Server Error')
    }
})

// @route GET api/profile/github/:username
// @desc Get user repos from Github
// @access Public
router.get('/github/:user', async (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.user}/repos?per_page=5&sort=created:asc`,
            method: 'GET',
            headers: {
                'user-agent': 'node.js',
                Authorization: `token ${process.env.GITHUB_OATH_TOKEN}`
            }
        }

        request(options, (error, response, body) => {
            if (error) console.error(error)

            //: This check doesn't work; also body still has a length. Need better handler
            // RESOLVED: My test case was a valid profile
            if (response.statusCode !== 200) {
                return res.status(400).json({msg : 'No github profile found'})
            }

            return res.json(JSON.parse(body))
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send('Server error')
    }
})

module.exports = router