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

    const condition = null // no match condition

    const posts2 = await Post.aggregate([
        {$match: {condition}},
        {$addFields: {
            numLikes: {$size: "$post_likes"},
            "post_comments.commenter": "$comment_author.username"
        }},
        {
            $lookup: {
                from: "users",
                localField: "post_author",
                foreignField: "_id",
                as: "post_author"
            }
        },
        {$unwind: "$post_author"},
        {
            $lookup: {
                from: "users",
                localField: "post_comments.comment_author",
                foreignField: "_id",
                as: "post_comments.comment_author"
            }
        },
        {
            $project: {
                _id: 1,
                post_title: 1,
                post_timestamp: 1,
                numLikes: 1,
                "post_author.username": 1,
                // post_comments: 1,
                "post_comments.comment_description":1,
                "post_comments.comment_timestamp":1,
                "post_comments.comment_author.username":1,
                // "post_comments.commenter": 1
                // "comment_author":"$comment_author.username"

            }
        }, 
        {
            $sort: {
                numLikes: 1,
                post_timestamp: -1
            }
        }
    ])

    // console.log(posts2)

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
            numLike: 1
        }).exec()
        
        res.send(posts2)
    }catch(err){
        console.log(err)
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
        }).exec()
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
            numLikes: 1,
            post_timestamp: POST_SORT
        }).exec()

        res.send(posts)

    }catch(err){
        res.status(400).send({error:err})
    }
})

module.exports = router