const express = require('express')
const router = express.Router();
const Section = require('../db/Section')

router.use(express.json())

router.route('/').get((req, res) => {
    Section.find()
        .then(section => res.json(section))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/cid').get((req, res) => {
    const course_id = req.query.course_id
    Section.find({ course_id: course_id })
        .then(section => res.json(section))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/cids').get((req, res) => {
    const course_id = req.query.course_id
    const section = req.query.section
    Section.find({ course_id: course_id, section: section })
        .then(section => res.json(section))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const section = new Section({...req.body });

    try {
        console.log(section)
        await section.save();
        res.status(200).send({ section })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const section = await Section.findById({ _id: req.params.id })
        if (!section)
            return res.status(404).send()
        res.status(200).send(section)
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/:id', async(req, res) => {
    let arr = []
    try {
        const section = await Section.findById({ _id: req.params.id })
        if (!section)
            return res.status(404).send()
        arr = section.students
        console.log('arr', arr)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
    const brr = arr.filter((ele) => (ele.registration_number == req.body.registration_number))
    if (brr.length > 0) {
        res.status(500).send('this is already in the list')
        return
    }
    console.log(req.body)
    arr.push(req.body)
    const chg = { students: arr }



    try {
        const section = await Section.findByIdAndUpdate(req.params.id, chg, { new: true, runValidators: true })
        if (!section)
            return res.status(404).send()
        res.status(200).send(section)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.patch('/reg/:id', async(req, res) => {
    let arr = []
    try {
        const section = await Section.findById({ _id: req.params.id })
        if (!section)
            return res.status(404).send()
        arr = section.students
        console.log('arr', arr)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
    console.log(req.body)
    arr = arr.filter((ele) => (ele.registration_number != req.body.registration_number))
    const chg = { students: arr }



    try {
        const section = await Section.findByIdAndUpdate(req.params.id, chg, { new: true, runValidators: true })
        if (!section)
            return res.status(404).send()
        res.status(200).send(section)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/fn/:id', async(req, res) => {

    try {
        const session = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!session)
            return res.status(404).send()
        res.status(200).send(session)
    } catch (e) {
        res.status(500).send(e.message)
    }
})








router.delete('/:id', async(req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id)
        if (!section)
            return res.status(404).send()
        res.status(200).send(section)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router