const express = require("express")
const Post = require("../models/Post")
const User = require("../models/User")
const router = express.Router()
const verifyToken = require("../verifyToken")
const {postValidation} = require("../validations/validation")

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

// function to get posts
async function getPosts(condition={null:null}) {
    try{
        const posts = await Post.aggregate([
            {$match: condition},
            {$addFields: {numLikes: {$size: "$post_likes"}}},
            {
                $lookup: {
                    from: "users",
                    localField: "post_author",
                    foreignField: "_id",
                    as: "post_author"
                }
            },
            {$unwind: "$post_author"},
            // {
            //     $lookup: {
            //         from: "users",
            //         let: {""},
            //         // localField: "post_comments.comment_author",
            //         // foreignField: "_id",
            //         as: "post_comments.comment_author"
            //     }
            // },
            {
                $project: {
                    _id: 1,
                    post_title: 1,
                    post_description: 1,
                    post_timestamp: 1,
                    numLikes: 1,
                }
            }, 
            {
                $sort: {
                    numLikes: -1,
                    post_timestamp: -1
                }
            }
        ])
        return posts
    }catch(err){
        throw(err) //bubbles error so it can be sent to user
    }
}

// get all posts
router.get("/", verifyToken, async(req, res)=> {
    try {
        const posts = await getPosts()
        res.send(posts)
    }catch(err){
        console.log(err)
        res.status(400).send({error:err})
    }
})

// route for a single post
router.get('/:postId', verifyToken, async(req, res)=> {
    const condition = {_id:req.params.postId}
    try{
        const posts = await getPosts(condition)
        res.send(posts)
    }catch(err){
        res.status(400).send({error:err})
    }
})

// route to get a user's posts
router.get("/myposts", verifyToken, async(req, res)=> {
    const condition = {post_author:req.user._id}
    try{
        const posts = await getPosts(condition)
        res.send(posts)
    }catch(err){
        res.status(400).send({error:err})
    }
})

module.exports = router