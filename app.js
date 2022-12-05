const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

const authRoute = require('./routes/auth')
const commentsRoute = require('./routes/comments')
const postsRoute = require('./routes/posts')
const reactsRoute = require('./routes/reacts')

app.use(bodyParser.json())
app.use('/api/user', authRoute)
app.use('/api/comment', commentsRoute)
app.use('/api/post', postsRoute)
app.use('/api/react', reactsRoute)

mongoose.connect(process.env.DB_CONNECTOR, ()=> {
    console.log('DB connecting...')
})

app.listen(3000, ()=> {
    console.log('server is running')
})