const jwt = require('jsonwebtoken')
const Admin = require('../db/Admin.js')
const authAdmin = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = await jwt.verify(token, 'thisisnewadmin')
        console.log('decode : ', decode, token)
        const admin = await Admin.findOne({ _id: decode._id, 'tokens.token': token })
        if (!admin)
            throw new Error()
        console.log(admin)
        req.token = token
        req.admin = admin
        next();
    } catch (e) {
        res.status(403).send({ error: "error in Authentication" })
    }
}

module.exports = authAdmin