const express = require('express')
const app = express()

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

const authRoute = require('./routes/auth')
const postsRoute = require('./routes/posts')
const usersRoute = require('./routes/users')
const commentsRoute = require('./routes/comments')

app.use(bodyParser.json())
app.use('/api/user', authRoute)
app.use('/api/post', postsRoute)
app.use('/api/comment', postsRoute)

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