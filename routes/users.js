const express = require('express')
const router = express.Router()

router.get('/', (req, res)=> {
    console.log('inside users route')
    res.send({"username":"", "password":""})
})

module.exports = router