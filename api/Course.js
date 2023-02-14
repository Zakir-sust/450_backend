const express = require('express')
const router = express.Router();
const Course = require('../db/Course')
const Byreg = require('../db/Byreg')
const Bydate = require('../db/Bydate')

router.use(express.json())

router.route('/').get((req, res) => {
    Course.find()
        .then(course => res.json(course))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/teacher').get((req, res) => {
    const teacher_id = req.query.teacher_id
    Course.find({ teacher_id: teacher_id })
        .then(course => res.json(course))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/session').get((req, res) => {
    const session_id = req.query.session_id
    Course.find({ session_id: session_id })
        .then(course => res.json(course))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const student = []
    const collaborator = []
    const record = []
    const section = [{ section: "A" }]
    const course = new Course({...req.body, collaborator, student, record, section });

    try {
        console.log(course)
        await course.save();
        res.status(200).send({ course })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.patch('/collaborator/:id', async(req, res) => {
    const course = await Course.findById({ _id: req.params.id })
    let col = course.collaborator
    col = col.filter((ele) => ele.id != req.body.id)
    const data = {...req.body }
    col.push(data)
    const pss = { collaborator: col }
    const crs = await Course.findByIdAndUpdate(req.params.id, pss, { new: true, runValidators: true })
    if (!crs) res.status(400).send('not found')
    else res.status(200).send(crs)
})

router.patch('/collaboratord/:id', async(req, res) => {
    const course = await Course.findById({ _id: req.params.id })
    let col = course.collaborator
    col = col.filter((ele) => ele.id != req.body.id)
    console.log(col)
    const pss = { collaborator: col }
    const crs = await Course.findByIdAndUpdate(req.params.id, pss, { new: true, runValidators: true })
    if (!crs) res.status(400).send('not found')
    else res.status(200).send(crs)
})

router.patch('/student/:id', async(req, res) => {
    const course = await Course.findById({ _id: req.params.id })
    let col = course.student
    col = col.filter((ele) => (ele.registration_number != req.body.registration_number))
    const data = {...req.body }
    col.push(data)
    const pss = { student: col }
    const crs = await Course.findByIdAndUpdate(req.params.id, pss, { new: true, runValidators: true })
    if (!crs) res.status(400).send('not found')
    else res.status(200).send(crs)
})

router.patch('/studentd/:id', async(req, res) => {
    const course = await Course.findById({ _id: req.params.id })
    console.log(course, req.body.registration_number)
    let col = course.student
    col = col.filter((ele) => (ele.registration_number != req.body.registration_number))
    console.log('student', col)
    const pss = { student: col }
    const crs = await Course.findByIdAndUpdate(req.params.id, pss, { new: true, runValidators: true })
    if (!crs) res.status(400).send('not found')
    else res.status(200).send(crs)
})

router.patch('/section/:id', async(req, res) => {
    const course = await Course.findById({ _id: req.params.id })
    let col = course.section
    let com = col.filter((ele) => (ele.section == req.body.section))

    if (com.length == 0) {
        const data = {...req.body }
        col.push(data)
        const pss = { section: col }
        const crs = await Course.findByIdAndUpdate(req.params.id, pss, { new: true, runValidators: true })
        if (!crs) res.status(400).send('not found')
        else res.status(200).send(crs)
    } else {
        res.status(200).send('already exists')
    }
})

router.patch('/sectiond/:id', async(req, res) => {
    const course = await Course.findById({ _id: req.params.id })
    const cid = course._id
    let col = course.section
    let cll = course.record
    let css = course.student
    console.log('col cll css', col, cll, css)
    col = col.filter((ele) => (ele.section != req.body.section))
    cll = cll.filter(ele => ele.section != req.body.section)
    css = css.filter(ele => ele.section != req.body.section)
    const pss = { section: col, record: cll, student: css }
    const crs = await Course.findByIdAndUpdate(req.params.id, pss, { new: true, runValidators: true })
    if (!crs) res.status(400).send('not found')
    const byreg = await Byreg.find({ course_id: cid, section: req.body.section })
    byreg.forEach(async(ele) => {
        const td = await Byreg.findByIdAndDelete(ele._id)
        if (!td) res.status(404).send('failed to delete a byreg')
    })
    const bydate = await Bydate.find({ course_id: cid, section: req.body.section })
    bydate.forEach(async(ele) => {
        const td = await Bydate.findByIdAndDelete(ele._id)
        if (!td) res.status(404).send('failed to delete a bydate')
    })
    res.status(200).send(crs)
})

router.patch('/record/:id', async(req, res) => {
    const course = await Course.findById({ _id: req.params.id })
    let col = course.record
    console.log('col', col)
    let com = col.filter((ele) => (ele.date == req.body.date && ele.section == req.body.section))
    if (com.length == 0) {
        const data = {...req.body }
        col.push(data)
        const pss = { record: col }
        const crs = await Course.findByIdAndUpdate(req.params.id, pss, { new: true, runValidators: true })
        if (!crs) res.status(400).send('not found')
        else res.status(200).send(crs)
    } else {
        res.status(200).send('it exists already')
    }
})

router.patch('/recordd/:id', async(req, res) => {
    const course = await Course.findById({ _id: req.params.id })
    let col = course.record
    col = col.filter((ele) => (ele.date != req.body.date || ele.section != req.body.section))
    const pss = { record: col }
    const crs = await Course.findByIdAndUpdate(req.params.id, pss, { new: true, runValidators: true })
    if (!crs) res.status(400).send('not found')
    else res.status(200).send(crs)
})



router.get('/:id', async(req, res) => {
    try {
        const course = await Course.findById({ _id: req.params.id })
        if (!course)
            return res.status(404).send()
        res.status(200).send(course)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    let crs
    let crr
    try {
        const course = await Course.findByIdAndDelete(req.params.id)
        if (!course)
            return res.status(404).send()
        crs = course._id
        crr = course

    } catch (e) {
        res.status(400).send()
    }
    const byreg = await Byreg.find({ course_id: crs })
    byreg.forEach(async(ele) => {
        const td = await Byreg.findByIdAndDelete(ele._id)
        if (!td) res.status(404).send('failed to delete a byreg')
    })
    const bydate = await Bydate.find({ course_id: crs })
    bydate.forEach(async(ele) => {
        const td = await Bydate.findByIdAndDelete(ele._id)
        if (!td) res.status(404).send('failed to delete a bydate')
    })
    res.status(200).send(crr)
})
module.exports = router