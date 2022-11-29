const express = require('express')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const router = express.Router()
const verifyToken = require('../verifyToken')

// add the validation here or in the auth bit...

const {postValidation, commentValidation} = require('../validations/validation')

router.post('/newpost', verifyToken, async(req, res)=>{
    console.log('in the new post route')
    const {error} = postValidation(req.body)
    if (error) {return res.status(400).send({message:error})}
    console.log('validation accepted')
    const author = await User.findById(req.user._id)
    if (!author) {return res.status(400).send({message:"user not found"})}
    console.log(author)
    const postData = new Post({
        post_title:req.body.title,
        post_description:req.body.description,
        post_author:author
    })
    try {
        const savePost = await postData.save()
        res.redirect('/')
    }catch(err){
        res.send({message:err})
    }
})

/* to be moved to comments.js
router.post('/:postId/comment', verifyToken, async(req, res)=> {
    // i need to capture the post id for the comment
    // make sure this is an atomic operation
    const {error} = commentValidation(req.body)
    if (error) {return res.status(400).send({message:error['details'][0]['message']})}
    try{
        const getPostbyId = await Post.findById(req.params.postId)

    }catch(err){
        res.send({message:err})
    }
})
*/

router.patch('/like/:postId', verifyToken, async(req, res)=> {
    // get the current number of likes and add one to it
    // add user-id to liked post array
    // add post-id to users-liked array
    try{
        const posts = await Post.find()
        res.send(["Congratulations!", posts])
    }catch(err){
        res.status(400).send({message:err})
    }
})

router.get('/', verifyToken, async(req, res)=> {
    // get by the most likes first and then chronological
    try{
        const posts = await Post.find()
        res.send(["Congratulations!", posts])
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router