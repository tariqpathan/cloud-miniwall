const express = require("express")
const Post = require("../models/Post")
const User = require("../models/User")
const router = express.Router()
const verifyToken = require("../verifyToken")
const {postValidation} = require("../validations/validation")

// setting values for sort-orders to keep consistency
const COMMENT_SORT = 1 // 1 = oldest-first
const POST_SORT = -1 // -1 = newest-first

router.post("/", verifyToken, async(req, res)=>{
    const {valError} = postValidation(req.body)
    if (valError) {
        return res.status(400).send({message:valError['details'][0]['message']})
    }
    try {
        const author = await User.findById(req.user._id)
        if (!author) {throw "author not found"}
        const postData = new Post({
            post_title:req.body.post_title,
            post_description:req.body.post_description,
            post_author:author,
            post_timestamp:Date.now() // added instead of using default
        })
    
        const savePost = await postData.save()
        res.redirect(`/api/post/${savePost._id}`)
    }catch(err){
        res.send({error:err})
    }
})

// get all posts
router.get("/", verifyToken, async(req, res)=> {

    try{
        
        const posts = await Post.find({}, {
            post_title: 1,
            post_description: 1,
            post_timestamp: 1,
            numLikes: {$size:"$post_likes"}
        }).populate({
            path: "post_author",
            model: "User",
            select: "-_id username",
        }).populate({
            path: "post_comments",
            model: "Comment",
            select: "-_id -__v comment_description comment_timestamp",
            populate: {
                path: "comment_author",
                model: "User",
                select: "-_id username"
            },
            sort: {
                post_timestamp: COMMENT_SORT
            }
        }).sort({
            post_timestamp: POST_SORT,
            numLikes: 1
        })

        res.send(posts)

    }catch(err){
        res.status(400).send({error:err})
    }
})

// route for a single post
router.get('/:postId', verifyToken, async(req, res)=> {
    try{
        const post = await Post.find({
            _id: req.params.postId
        }, 
        {
            post_title: 1,
            post_description: 1,
            post_timestamp: 1,
            numLikes: {$size:"$post_likes"}
        }).populate({
            path: "post_author",
            model: "User",
            select: "-_id username",
        }).populate({
            path: "post_comments",
            model: "Comment",
            select: "-_id -__v comment_description comment_timestamp",
            populate: {
                path: "comment_author",
                model: "User",
                select: "-_id username"
            },
            sort: {
                post_timestamp: COMMENT_SORT
            }
        })
        res.send(post)

    }catch(err){
        res.status(400).send({error:err})
    }
})

// route to get a user's posts
router.get("/myposts", verifyToken, async(req, res)=> {

    try{
        
        const posts = await Post.find({
            // find all posts belonging to the user
            post_author: req.user._id}, 
        {
            post_title: 1,
            post_description: 1,
            post_timestamp: 1,
            numLikes: {$size:"$post_likes"}
        }).populate({
            path: "post_author",
            model: "User",
            select: "-_id username",
        }).populate({
            path: "post_comments",
            model: "Comment",
            select: "-_id -__v comment_description comment_timestamp",
            populate: {
                path: "comment_author",
                model: "User",
                select: "-_id username"
            },
            sort: {
                post_timestamp: COMMENT_SORT
            }
        }).sort({
            post_timestamp: POST_SORT,
            numLikes: 1
        })

        res.send(posts)

    }catch(err){
        res.status(400).send({error:err})
    }
})

module.exports = router