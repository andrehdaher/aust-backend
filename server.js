const express= require('express')
const cors = require('cors')
const mongoose  = require('mongoose')
const dotenv = require("dotenv")
const userRoutes = require('./routes/userRoutes'); // ✅ المسار الصحيح
const auth = require('./controllers/auth')
const addStudent = require('./routes/addStudent')
const subject = require('./routes/subject')
const advertisement = require('./routes/advertisement')
dotenv.config()




const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/users', userRoutes);
app.use('/api', auth);
app.use('/api',addStudent)
app.use('/api',subject)
app.use('/api',advertisement)

async function startServer() {
    try {
        const MONGO_URI = process.env.MONGO_URI
        if (!MONGO_URI) {
            throw new Error('MONGODB_URI is not set in .env')
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not set in .env')
        }

        await mongoose.connect(MONGO_URI)
        console.log('Connected to MongoDB')

        const port = process.env.PORT || 5000
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    } catch (err) {
        console.error('Failed to start server:', err.message)
        process.exit(1)
    }
}

startServer()