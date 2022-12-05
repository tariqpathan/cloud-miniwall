const mongoose = require('mongoose')
const commentSchema = require('./Comment')
const userSchema = require('./User')

const postSchema = mongoose.Schema({
    
    post_title:{
        type:String,
        require:true,
        min:5,
        max:128,
    },
    post_description:{
        type:String,
        require:true,
        min:5,
        max:4096,
    },
    post_timestamp:{
        type:Date,
        default:Date.now(),
    },
    post_author:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "User",
        require:true,
    },
    post_likes:{
        type: [userSchema.schema]
    },
    post_comments:{
        type: [commentSchema.schema]
    }
})

// postSchema.virtual('numLikes').get( function () {
//     return this.post_likes.length})


module.exports = mongoose.model('Post', postSchema)

