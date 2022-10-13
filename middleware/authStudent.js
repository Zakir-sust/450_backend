const jwt = require('jsonwebtoken')
const Student = require('../db/Student.js')
const authStudent = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = await jwt.verify(token, 'thisisnewstudent')
        console.log('decode : ', decode, token)
        const student = await Student.findOne({ _id: decode._id, 'tokens.token': token })
        if (!student)
            throw new Error()
        console.log(student)
        req.token = token
        req.student = student
        next();
    } catch (e) {
        res.status(403).send({ error: "error in Authentication" })
    }
}

module.exports = authStudent