const express = require('express')
const Post = require('../models/Post')
const router = express.Router()
const verify = require('../verifyToken')

// add the validation here or in the auth bit...

const {postValidation, commentValidation} = require('../validations/validation')

router.post('/post', async(req, res)=>{
    const {error} = postValidation(req.body)
    if (error) {return res.status(400).send({message:error['details'][0]['message']})}
})

router.post('/comment', async(req, res)=> {
    // i need to capture the post id for the comment
    const {error} = commentValidation(req.body)
    if (error) {return res.status(400).send({message:error['details'][0]['message']})}    
})

router.post('/like', async(req, res)=> {
    // get the current number of likes and add one to it
})

router.get('/', verify, async(req, res)=> {
    try{
        const posts = await Post.find()
        res.send(posts)
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router