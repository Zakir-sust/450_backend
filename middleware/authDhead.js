const jwt = require('jsonwebtoken')
const Dhead = require('../db/Dhead.js')
const authDhead = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = await jwt.verify(token, 'thisisnewdhead')
        console.log('decode : ', decode, token)
        const dhead = await Dhead.findOne({ _id: decode._id, 'tokens.token': token })
        if (!dhead)
            throw new Error()
        console.log(dhead)
        req.token = token
        req.dhead = dhead
        next();
    } catch (e) {
        res.status(403).send({ error: "error in Authentication" })
    }
}

module.exports = authDhead