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

// @route PUT api/posts/like/:post_id
// @desc Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // Check that post exists
        if (!post) {
            return res.status(404).json({ msg: 'Post not found'})
        }

        // Check if post already been liked by this user
        if (post.likes.filter(like => like.user.toString()).length > 0) {
            return res.status(400).json({msg: 'Post already liked'})
        }

        // Exists, not already liked; push to front of like array
        post.likes.unshift({ user: req.user.id })

        await post.save()

        return res.json(post.likes)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Server error")
    }
})


// @route PUT api/posts/unlike/:post_id
// @desc Unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // Check that post exists
        if (!post) {
            return res.status(404).json({ msg: 'Post not found'})
        }

        // Check if post already been liked by this user
        if (post.likes.filter(like => like.user.toString()).length === 0) {
            return res.status(400).json({msg: 'Post has not been liked'})
        }

        // remove the like
        const index = post.likes.map(like => like.user.toString() ).indexOf(req.user.id)
        post.likes.splice(index, 1)

        await post.save()

        return res.json(post.likes)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Server error")
    }
})


// @route POST api/posts/comment/:post_id
// @desc Comment on a post
// @access Private
router.post('/comment/:id', [auth, [
    check('text', 'Text field must not be empty').not().isEmpty(),
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()})
    }

    try {
        // Get user w/o password field
        const user = await (await User.findById(req.user.id)).isSelected('-password')
        const post = await Post.findById(req.params.id)

        const comment =  {
            text: req.body.text,
            // Get these fields direct from the user we got via the auth wrapper
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
        }

        post.comments.unshift(comment)

        await post.save()

        return res.json(post.comments)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Server error")
    }
})


// @route DELETE api/posts/comment/:post_id/:comment_id
// @desc Delete a comment on a post
// @access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        // Get post
        const post = await Post.findById(req.params.id)

        // Check if post actually exists
        if (!post) {
            return res.status(404).json({ msg: 'Post not found'})
        }

        // Get the comment from the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        // Check that comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment not found'})
        }

        // Check user id matches comment user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({msg: 'User not authorized'})
        }
        // Remove the comment from the post
        const index = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id)
        post.comments.splice(index, 1)
        // Save the updated post
        await post.save()

        return res.json(post.comments)
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