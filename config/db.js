const mongoose = require('mongoose')
const config = require ('config')
// Load enviromental variables from our .env file
const dotenv = require('dotenv')
dotenv.config()

const db = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@devconnector-rgks2.mongodb.net/test?retryWrites=true&w=majority`

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('MongoDB Connected...')
    }
    catch(err) {
        console.log(err.message)
        // Exit on an error w/ failure
        process.exit(1)
    }
}

module.exports = connectDB