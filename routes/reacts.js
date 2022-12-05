const express = require('express')
const Post = require('../models/Post')
const User = require('../models/User')
const router = express.Router()
const verifyToken = require('../verifyToken')


router.put('/like/:postId', verifyToken, async(req, res)=>{
    
    const postLiker = await User.findById(req.user._id)
    if (!postLiker) {return res.status(400).send({message:"user not found"})}
    
    const post = await Post.findById(req.params.postId)
    if (!post) {return res.status(400).send({message:"post not found"})}

    if (postLiker.equals(post.post_author)) {
        return res.status(403).send({message:"an author cannot like their posts"})
    }
    
    try {
        await post.updateOne({
            $addToSet: {post_likes:postLiker}
        })
        const updatedPost = await Post.findById(req.params.postId)
        res.redirect(`/api/post/${updatedPost._id}`)
    }catch(err){
        res.send({error:err})
    }
})

router.put('/unlike/:postId', verifyToken, async(req, res)=>{

    const postLiker = await User.findById(req.user._id)
    if (!postLiker) {return res.status(400).send({message:"user not found"})}
    
    const post = await Post.findById(req.params.postId)
    if (!post) {return res.status(400).send({message:"post not found"})}

    try {
        await post.updateOne({
            $pull: {post_likes:postLiker}
        })
        const updatedPost = await Post.findById(req.params.postId)
        res.redirect(`/api/post/${updatedPost._id}`)
    }catch(err){
        res.send({error:err})
    }
})

module.exports = router