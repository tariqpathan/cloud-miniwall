const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')
const usersRoute = require('./routes/users')
const commentsRoute = require('./routes/comments')
const likesRoute = require('./routes/likes')

app.use(bodyParser.json())
app.use('/api/user', authRoute)
app.use('/api/post', postsRoute)
app.use('/api/comment', commentsRoute)
app.use('/api/like', likesRoute)

app.use('/users', usersRoute) // use for debugging

mongoose.connect(process.env.DB_CONNECTOR, ()=> {
    console.log('DB connecting...')
})

app.get('/', (req, res) => {
    res.send('This is the homepage')
})

app.listen(3000, ()=> {
    console.log('server is running')
})