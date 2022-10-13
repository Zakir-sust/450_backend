const express = require('express')
const router = express.Router();
const Access = require('../db/Access')

router.use(express.json())

router.route('/').get((req, res) => {
    Access.find()
        .then(access => res.json(access))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/teacher').get((req, res) => {
    const teacher = req.query.teacher
    Access.find({ teacher: teacher })
        .then(access => res.json(access))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const access = new Access({...req.body });
    console.log(access)

    try {
        console.log(access)
        await access.save();
        res.status(200).send({ access })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const access = await Access.findById({ _id: req.params.id })
        if (!access)
            return res.status(404).send()
        res.status(200).send(access)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const access = await Access.findByIdAndDelete(req.params.id)
        if (!access)
            return res.status(404).send()
        res.status(200).send(access)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router