const express = require('express')
const router = express.Router();
const ApprovalCo = require('../db/ApprovalCo')

router.use(express.json())

router.route('/').get((req, res) => {
    ApprovalCo.find()
        .then(approveco => res.json(approveco))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/teacher').get((req, res) => {
    const teacher = req.query.teacher
    ApprovalCo.find({ teacher: teacher })
        .then(approvalco => res.json(approvalco))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    console.log(req.body)
    const approvalco = new ApprovalCo({...req.body });
    console.log(approvalco)

    try {
        console.log(approvalco)
        await approvalco.save();
        res.status(200).send({ approvalco })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const access = await ApprovalCo.findById({ _id: req.params.id })
        if (!access)
            return res.status(404).send()
        res.status(200).send(access)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const access = await ApprovalCo.findByIdAndDelete(req.params.id)
        if (!access)
            return res.status(404).send()
        res.status(200).send(access)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router