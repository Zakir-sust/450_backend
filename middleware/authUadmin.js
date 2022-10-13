const jwt = require('jsonwebtoken')
const UAdmin = require('../db/Uadmin.js')
const authUAdmin = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = await jwt.verify(token, 'thisisnewuadmin')
        console.log('decode : ', decode, token)
        const uadmin = await UAdmin.findOne({ _id: decode._id, 'tokens.token': token })
        if (!uadmin)
            throw new Error()
        console.log(uadmin)
        req.token = token
        req.uadmin = uadmin
        next();
    } catch (e) {
        res.status(403).send({ error: "error in Authentication" })
    }
}

module.exports = authUAdmin