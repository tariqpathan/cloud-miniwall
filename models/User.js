const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:5,
        max:256
    },
    email:{
        type:String,
        require:true,
        min:6,
        max:256
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024
    },
    date:{
        type:Date,
        default:Date.now()
    },
    liked_posts:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Post"
        }]
    }
})

module.exports = mongoose.model('User', userSchema)