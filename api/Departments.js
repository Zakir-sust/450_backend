const express = require('express')
const router = express.Router();
const Departments = require('../db/Departments')
const Dhead = require('../db/Dhead')
const Teacher = require('../db/Teacher')
const Student = require('../db/Student')
const Session = require('../db/Session')
const Course = require('../db/Course')
const Byreg = require('../db/Byreg')
const Bydate = require('../db/Bydate')

router.use(express.json())

router.route('/').get((req, res) => {
    Departments.find()
        .then(university => res.json(university))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/uni').get((req, res) => {
    const uni = req.query.university
    Departments.find({ university: uni })
        .then(department => res.json(department))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const Department = new Departments({...req.body });

    try {
        console.log(Department)
        await Department.save();
        res.status(200).send({ Department })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const Department = await Departments.findById({ _id: req.params.id })
        if (!Department)
            return res.status(404).send()
        res.status(200).send(Department)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const department = await Departments.findByIdAndDelete(req.params.id)
        if (!department)
            return res.status(404).send()
        const uni = department.university
        const dept = department.department

        const dhead = await Dhead.findOne({ university: uni, department: dept })
        const dhd = await Dhead.findByIdAndDelete(dhead._id)
        if (!dhead)
            return res.status(404).send('didnt find any dhead')
        if (!dhd)
            return res.status(404).send('didnt find any dhead while delete')
        const teacher = await Teacher.find({ university: uni, department: dept })
        teacher.forEach(async(ele) => {
            const td = await Teacher.findByIdAndDelete(ele._id)
            console.log('teacher', td)
            if (!td) res.status(404).send('failed to delete a teacher')
        })
        const student = await Student.find({ university: uni, department: dept })
        student.forEach(async(ele) => {
            const td = await Student.findByIdAndDelete(ele._id)
            if (!td) res.status(404).send('failed to delete a student')
        })
        const session = await Session.find({ university: uni, department: dept })
        session.forEach(async(ele) => {
            const td = await Session.findByIdAndDelete(ele._id)
            console.log('student', td)
            if (!td) res.status(404).send('failed to delete a session')
        })
        const course = await Course.find({ university: uni, department: dept })
        console.log('course')
        course.forEach(async(ele) => {
            const td = await Course.findByIdAndDelete(ele._id)
            if (!td) res.status(404).send('failed to delete a course')
        })
        const byreg = await Byreg.find({ university: uni, department: dept })
        byreg.forEach(async(ele) => {
            const td = await Byreg.findByIdAndDelete(ele._id)
            if (!td) res.status(404).send('failed to delete a byreg')
        })
        const bydate = await Bydate.find({ university: uni, department: dept })
        bydate.forEach(async(ele) => {
            const td = await Bydate.findByIdAndDelete(ele._id)
            if (!td) res.status(404).send('failed to delete a bydate')
        })
        res.status(200).send(department)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router