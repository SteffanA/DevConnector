const express = require('express')
const router = express.Router()
const auth  = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const Post = require('../../models/Posts')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route POST api/posts
// @desc Create a post
// @access Private
router.post('/', [auth, [
    check('text', 'Text field must not be empty').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()})
    }

    try {
        // Get user w/o password field
        const user = await (await User.findById(req.user.id)).isSelected('-password')

        const newPost =  new Post({
            text: req.body.text,
            // Get these fields direct from the user we got via the auth wrapper
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
        })

        const post = await newPost.save()

        return res.json(post)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Server error")
    }
})

// @route GET api/posts
// @desc Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        // Get posts by most recent first
        const posts = await Post.find().sort({ date: -1})
        return res.json(posts)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Server error")
    }
})


// @route GET api/posts/:post_id
// @desc Get post by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        // Get posts by most recent first
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found'})
        }

        return res.json(post)
    } catch (error) {
        console.error(error.message)
        // If a formatted ObjectId, post not found
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'})
        }
        return res.status(500).send("Server error")
    }
})


// @route DELETE api/posts/:post_id
// @desc Delete a post
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Get posts by most recent first
        const post = await Post.findById(req.params.id)

        // Check if post actually exists
        if (!post) {
            return res.status(404).json({ msg: 'Post not found'})
        }

        // Check user id match's post user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'})
        }
        // Remove the post
        await post.remove()

        return res.json({msg: 'Post removed'})
    } catch (error) {
        console.error(error.message)
        // If a formatted ObjectId, post not found
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found'})
        }
        return res.status(500).send("Server error")
    }
})

module.exports = router