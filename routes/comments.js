const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const verifyToken = require('../verifyToken')

const {commentValidation} = require('../validations/validation')

router.post('/:postId', verifyToken, async(req, res)=>{
    const {valError} = commentValidation(req.body)
    if (valError) {
        return res.status(400).send({message:valError['details'][0]['message']})
    }
    
    try {
        const post = await Post.findById(req.params.postId)
        const author = await User.findById(req.user._id)
        // additional validations
        if (!post) {throw "post not found"}
        if (!author) {throw "author not found"}
        if (author.equals(post.post_author)) {
            throw "author can't comment"
        }
        
        const commentData = new Comment({
            comment_description:req.body.comment_description,
            comment_author:author
        })
        const updatedComment = await commentData.save()
        await post.updateOne({
            $push: {post_comments:updatedComment}
        })
        res.redirect(`/api/post/${req.params.postId}`)
        
    }catch(err){
        res.send({error:err})
    }
})

module.exports = router