const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

// Auth middleware
module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token')

    // check if no token exists
    if (!token) {
        return res.status(401).json({msg: 'No token, authorization denied'})
    }

    // Verify token
    try {
        // Decode our token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Set our user to the decoded token
        req.user = decoded.user
        next() // move onto the next middleware function via required callback
    }
    catch (err) {
        return res.status(401).json({msg: 'Token is not valid'})
    }
}