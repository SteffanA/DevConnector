const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const auth = require('../../middleware/auth') // use our auth middleware
const User = require('../../models/User')

// @route GET api/auth
// @desc Test route
// @access Public
router.get('/', auth, async (req, res) => {
    // Access our user from the request token
    try{
        // Get our user by id and strip the password field
        const user = await User.findById(req.user.id).select('-password')
        return res.json(user)
    }
    catch (err) {
        console.error(err.message)
        return res.status(500).send('Server error')
    }
})

// @route POST api/auth
// @desc Authenticate user & get token
// @access Public
router.post('/', [
    // Do our checks on the data we recieve to ensure it's valid
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Password is required'
    ).exists()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Send bad request back if we had errors
        return res.status(400).json({ errors: errors.array() })
    }

    const {email, password} = req.body

    try {

        // See if user exists
        let user = await User.findOne({email: email})

        if (!user) {
            // Couldn't find the user
            return res.status(400).json({ errors: [ {msg: 'Invalid credentials'}]})
        }

        // Ensure password matches what's on file
        // Compare the given password to encyrpted password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ errors: [ {msg: 'Invalid credentials'}]})
        }

        // Return jsonwebtoken; allow user to login right away after registration
        const payload = {
            user: {
                id: user.id
            }
        }

        // Set our timeout to be extended in development
        const timeout = (process.env.DEVELOPMENT ? 360000 : 3600)

        jwt.sign(
            payload, // pass in payload (user id)
            process.env.JWT_SECRET, // pass secret
            {expiresIn: timeout}, //pass timeout
            (err, token) => { // send token to client on callback if no err
                if (err) {
                    throw err
                }
                // No error, send our token
                return res.json({token})
            }
        )
        console.log('User registered')
    }
    catch (err) {
        console.error(err.message)
        return res.status(500).send('Server error')
    }
})

module.exports = router