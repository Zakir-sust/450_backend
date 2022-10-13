const jwt = require('jsonwebtoken')
const Teacher = require('../db/Teacher.js')
const authTeacher = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = await jwt.verify(token, 'thisisnewteacher')
        console.log('decode : ', decode, token)
        const teacher = await Teacher.findOne({ _id: decode._id, 'tokens.token': token })
        if (!teacher)
            throw new Error()
        console.log(teacher)
        req.token = token
        req.teacher = teacher
        next();
    } catch (e) {
        res.status(403).send({ error: "error in Authentication" })
    }
}

module.exports = authTeacher