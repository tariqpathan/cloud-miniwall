const express = require('express')
const Post = require('../models/Post')
const User = require('../models/User')
const router = express.Router()
const verifyToken = require('../verifyToken')


router.put('/:postId', verifyToken, async(req, res)=>{
    
    const postLiker = await User.findById(req.user._id)
    if (!postLiker) {return res.status(400).send({message:"user not found"})}
    
    const post = await Post.findById(req.params.postId)
    if (!post) {return res.status(400).send({message:"post not found"})}

    if (postLiker.equals(post.post_author2)) { //change this back!
        return res.status(403).send({message:"an author cannot like their posts"})
    }
    //clears the array
    //await post.updateOne({$set: {'post_likes':[]}})
    try {
        await post.updateOne({
            $addToSet: {post_likes:postLiker}
        })
        const updatedPost = await Post.findById(req.params.postId)
        res.send({
            likes: updatedPost.post_likes.length
        })
    }catch(err){
        res.send({error:err})
    }
})

router.put('/toggle/:postId', verifyToken, async(req, res)=>{
    
    const postLiker = await User.findById(req.user._id)
    if (!postLiker) {return res.status(400).send({message:"user not found"})}
    
    const post = await Post.findById(req.params.postId)
    if (!post) {return res.status(400).send({message:"post not found"})}

    if (postLiker.equals(post.post_author2)) { //change this back!
        return res.status(403).send({message:"an author cannot like their posts"})
    }
    
    //clears the array
    //await post.updateOne({$set: {'post_likes':[]}})

    try {
        
        const result = post.post_likes.some((user) => postLiker.equals(user))
        
        if (result) {
            await post.updateOne({
                $pull: {post_likes:postLiker}
            })
        } else {
            await post.updateOne({
                $addToSet: {post_likes:postLiker}
            })
        }
        const updatedPost = await Post.findById(req.params.postId)
        
        res.send({
            likes: updatedPost.post_likes.length
        })

    }catch(err){
        res.send({error:err})
    }
})

module.exports = router