const express = require('express')
const router = express.Router();
const Bydate = require('../db/Bydate')

router.use(express.json())

router.route('/').get((req, res) => {
    Bydate.find()
        .then(bydate => res.json(bydate))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/sec').get((req, res) => {
    const course_id = req.query.course_id
    const section = req.query.section
    Bydate.find({ course_id: course_id, section: section })
        .then(bydate => res.json(bydate))
        .catch(err => res.status(400).json('Error: ' + err));
})


router.post('/add', async(req, res) => {
    console.log('body here',req.body)
    const bydate = new Bydate({...req.body });

    try {
        console.log('bydate data',bydate)
        await bydate.save();
        res.status(200).send({ bydate })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const bydate = await Bydate.findById({ _id: req.params.id })
        if (!bydate)
            return res.status(404).send()
        res.status(200).send(bydate)
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/:id', async(req, res) => {

    try {
        const bydate = await Bydate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!bydate)
            return res.status(404).send()
        res.status(200).send(bydate)
    } catch (e) {
        res.status(500).send(e.message)
    }
})



router.delete('/:id', async(req, res) => {
    try {
        const bydate = await Bydate.findByIdAndDelete(req.params.id)
        if (!bydate)
            return res.status(404).send()
        res.status(200).send(bydate)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router