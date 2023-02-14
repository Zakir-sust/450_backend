const express = require('express')
const router = express.Router();
const Session = require('../db/Session')

router.use(express.json())

router.route('/').get((req, res) => {
    Session.find()
        .then(session => res.json(session))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/ud').get((req, res) => {
    const university = req.query.university
    const department = req.query.department
    Session.find({ university: university, department: department })
        .then(session => res.json(session))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const students = []
    const session = new Session({...req.body, students });
    console.log(session)

    try {
        console.log(session)
        await session.save();
        res.status(200).send({ session })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const session = await Session.findById({ _id: req.params.id })
        if (!session)
            return res.status(404).send()
        res.status(200).send(session)
    } catch (e) {
        res.status(400).send()
    }
})




router.delete('/:id', async(req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id)
        if (!session)
            return res.status(404).send()
        res.status(200).send(session)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router