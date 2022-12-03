const express = require('express')
const mongoose = require('mongoose')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const router = express.Router()
const verifyToken = require('../verifyToken')

const {commentValidation} = require('../validations/validation')

router.post('/:postId', verifyToken, async(req, res)=>{
    const {error} = commentValidation(req.body)
    if (error) {return res.status(400).send({message:error['details'][0]['message']})}
    
    /*
    const author = await User.findById(req.user._id)
    if (!author) {return res.status(400).send({message:"user not found"})}
    const parentPost = Post.find({_id:req.params.postId})
    console.log(typeof(parentPost))
    if (!parentPost) {return res.status(400).send({message:"post for comment not found"})}
    */
    try {
        const post = await Post.findById(req.params.postId)
        const author = await User.findById(req.user._id)
        // check post author doesn't equal to comment author
        const commentData = new Comment({
            comment_parent:post,
            comment_description:req.body.comment_description,
            comment_author:author
        })
        
        await post.updateOne({
            $push: {post_comments:commentData}
        })
        res.send({message:"success"})
        
    }catch(err){
        res.send({error:err})
    }

})

module.exports = router