const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, //of type object id reference
        ref: 'users' // Reference our users model
    },
    text: {
        type: String,
        required: true
    },
    // Sotring next two here to avoid digging deeper into user model
    
    // Name of the user, not the post.
    name: {
        type: String,
    },
    // Avatar of the user
    avatar: {
        type: String, // TODO note in vid was string not String - intentional?
    },
    likes: [
        {
            // Array of user objects; prevent users from liking the same multiple times
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Post = mongoose.model('post', PostSchema)