const express = require('express')
const Post = require('../models/Post')
const User = require('../models/User')
const Comment = require('../models/Comment')
const router = express.Router()
const verifyToken = require('../verifyToken')


const {postValidation} = require('../validations/validation')

router.post('/newpost', verifyToken, async(req, res)=>{
    console.log('in the new post route')
    const {error} = postValidation(req.body)
    if (error) {return res.status(400).send({message:error})}
    console.log('validation accepted')
    const author = await User.findById(req.user._id)
    if (!author) {return res.status(400).send({message:"user not found"})}
    console.log(author)
    const postData = new Post({
        post_title:req.body.post_title,
        post_description:req.body.post_description,
        post_author:author
    })
    try {
        const savePost = await postData.save()
        res.send({message:"success"})
    }catch(err){
        res.send({message:err})
    }
})

router.get('/', verifyToken, async(req, res)=> {
    // get by the most likes first and then chronological
    // filter output to provide title, description, timestamp, author, no_likes

    try{
        
        const postsTwo = await Post.find({})

        const posts = await Post.find({}, {
            post_title: 1,
            post_description: 1,
            post_timestamp: 1,
            post_author: 1
            // post_likes: post_likes.length
            // post_comments: {
            //     comment_description: 1
            // }
        }).populate('post_comments', 'post_author').
        exec()
        res.send(["Congratulations!", postsTwo])
    }catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router