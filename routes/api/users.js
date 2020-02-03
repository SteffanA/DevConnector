const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const User = require('../../models/User')

// @route POST api/users
// @desc Register user
// @access Public
router.post('/', [
    // Do our checks on the data we recievbe to ensure it's valid
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Send bad request back if we had errors
        return res.status(400).json({ errors: errors.array() })
    }

    const {name, email, password} = req.body

    try {

        // See if user exists
        let user = await User.findOne({email: email})

        if (user) {
            // Use already exists; bad request
            return res.status(400).json({ errors: [ {msg: 'User already exists'}]})
        }

        // Get user's gravatar
        const avatar = gravatar.url(email, {
            s: '200',//size
            r: 'pg',//rating
            d: 'mm',// default image
        })

        // Create our user but don't save yet
        user = new User({
            name,
            email,
            avatar,
            password
        })

        // Encypt passwor
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        // Save our user w/ hashed password
        await user.save()


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