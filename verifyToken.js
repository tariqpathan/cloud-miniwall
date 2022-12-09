const jsonwebtoken = require('jsonwebtoken')

function auth(req, res, next){
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).send({error: "access denied, login required"})
    }
    try{
        const verified = jsonwebtoken.verify(token, process.env.TOKEN_SECRET)
        req.user=verified
        next()
    }catch(err){
        console.log(err)
        return res.status(401).send({error:"verification failed"})
    }
}

module.exports=auth