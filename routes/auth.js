// file for authentication
const express = require('express')
const User = require('../models/User')
const router = express.Router()

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

const {registerValidation, loginValidation} = require('../validations/validation')

router.post('/register', async(req, res) => {
    
    // checking for valid user input and username is unique
    const {valError} = registerValidation(req.body)
    if (valError) {
        return res.status(400).send({message:valError['details'][0]['message']})
    }
    const userExists = await User.findOne({
        $or: [{
            email:req.body.email}, 
            {username:req.body.username}
        ]})
    if (userExists) {
        return res.status(400).send({message:"user already exists"})
    }

    // hashing password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)
    
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })
    try{
        const savedUser = await user.save()
        res.send(savedUser.username)
    }catch(err){
        res.status(400).send({error:err})
    }
})

router.post('/login', async(req, res)=>{
    const {valError} = loginValidation(req.body)
    if (valError) {
        return res.status(400).send({message:valError['details'][0]['message']})
    }
    const user = await User.findOne({
        $or: [{
            email:req.body.email},
            {username: req.body.username},
        ]})
    if (!user) {return res.status(400).send({message: "user does not exist"})}

    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    if (!passwordValidation) {
        return res.status(400).send({message:"incorrect password"})
    }

    // Generate an authorisation token
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({'auth-token':token}) //send token via header and message
})

module.exports = router