const express = require('express')
const router = express.Router();
const Studentlist = require('../db/Studentlist')

router.use(express.json())

router.route('/').get((req, res) => {
    Studentlist.find()
        .then(studentlist => res.json(studentlist))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/sid').get((req, res) => {
    const section_id = req.query.section_id
    Studentlist.find({ section_id: section_id })
        .then(studentlist => res.json(studentlist))
        .catch(err => res.status(400).json('Error: ' + err));
})


router.post('/add', async(req, res) => {
    const studentlist = new Studentlist({...req.body });

    try {
        console.log(studentlist)
        await studentlist.save();
        res.status(200).send({ studentlist })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const studentlist = await Studentlist.findById({ _id: req.params.id })
        if (!studentlist)
            return res.status(404).send()
        res.status(200).send(studentlist)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const studentlist = await Studentlist.findByIdAndDelete(req.params.id)
        if (!studentlist)
            return res.status(404).send()
        res.status(200).send(studentlist)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router