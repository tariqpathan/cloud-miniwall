const express = require('express')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const router = express.Router()
const verifyToken = require('../verifyToken')

const {commentValidation} = require('../validations/validation')

router.post('/:postId', verifyToken, async(req, res)=>{
    // i need to capture the post id for the comment
    // make sure this is an atomic operation
    const {error} = commentValidation(req.body)
    if (error) {return res.status(400).send({message:error['details'][0]['message']})}
    const author = await User.findById(req.user._id)
    if (!author) {return res.status(400).send({message:"user not found"})}
    const parentPost = Post.findById(req.params.postId)
    if (!parentPost) {return res.status(400).send({message:"post for comment not found"})}
    
    const commentData = new Post({
        comment_parent:parentPost,
        comment_title:req.body.title,
        comment_description:req.body.description,
        comment_author:author
    })
    try{
        //push the commentId to the posts array
        
        const getPostById = await Post.updateById(req.param.postId)
        getPostById.post_comments.push()
    }catch(err){
        res.send({message:err})
    }
})