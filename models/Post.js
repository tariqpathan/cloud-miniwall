const mongoose = require('mongoose')

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
        type:Number,
        default:0,
    },
    // consider removing this and populating when queried
    post_comments:{
        type:mongoose.Schema.Types.ObjectId, ref:"Comment",
        require:false,
        max:128,
    }
    
})

module.exports = mongoose.model('Post', postSchema)
