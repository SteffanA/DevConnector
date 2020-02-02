const mongoose = require('mongoose')
const config = require ('config')
const db = `mongodb+srv://process.env.MONGO_USER:process.env.MONGO_PASS@devconnector-rgks2.mongodb.net/test?retryWrites=true&w=majority`

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
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