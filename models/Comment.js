const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    comment_description:{
        type:String,
        require:true,
        min:5,
        max:4096,
    },
    comment_timestamp:{
        type:Date,
        default:Date.now(),
    },
    comment_author:{
        type:mongoose.Schema.Types.ObjectId, 
        ref: "User",
        require:true,
    }
})

module.exports = mongoose.model('Comment', commentSchema)