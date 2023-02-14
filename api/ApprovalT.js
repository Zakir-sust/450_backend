const express = require('express')
const router = express.Router();
const ApprovalT = require('../db/ApprovalT')
const Teacher = require('../db/Teacher')

router.use(express.json())

router.route('/').get((req, res) => {
    const university = req.query.university
    const department = req.query.department
    ApprovalT.find({ university: university, department: department })
        .then(approvals => res.json(approvals))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const newApprovalT = new ApprovalT({...req.body });

    try {
        console.log(newApprovalT)
        await newApprovalT.save();
        res.status(200).send({ newApprovalT })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/:secret', async(req, res, next) => {
    Teacher.findOne({
            secret: req.params.secret,
        })
        .then(async(teacher) => {
            if (!teacher) {
                return res.status(404).send({ message: "Teacher Not found." });
            }

            if (teacher.status == true) res.status(400).send('status true');
            else {
                teacher.status = true;
                await teacher.save(async(err) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    const id = teacher._id
                    const university = teacher.university
                    const department = teacher.department
                    const name = teacher.name
                    const email = teacher.email
                    const phone = teacher.phone
                    const avatar = teacher.avatar
                    const newApprovalT = new ApprovalT({ id, email, name, phone, avatar, university, department });
                    try {
                        if (teacher.activated == true) res.status(400).send('already activated');
                        else {
                            console.log(newApprovalT)
                            await newApprovalT.save();
                            res.status(200).send({ newApprovalT })
                        }
                    } catch (e) {
                        res.status(400).send(e);
                    }

                });
            }
        })
        .catch((e) => console.log("error", e));
})

router.get('/:id', async(req, res) => {
    try {
        const approvalT = await ApprovalT.findById({ _id: req.params.id })
        if (!approvalT)
            return res.status(404).send()
        res.status(200).send(approvalT)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const approvalT = await ApprovalT.findByIdAndDelete(req.params.id)
        if (!approvalT)
            return res.status(404).send()
        res.status(200).send(approvalT)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router