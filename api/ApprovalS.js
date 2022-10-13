const express = require('express')
const router = express.Router();
const ApprovalS = require('../db/ApprovalS')
const Student = require('../db/Student')

router.use(express.json())

router.route('/').get((req, res) => {
    const university = req.query.university
    const department = req.query.department
    ApprovalS.find({ university: university, department: department })
        .then(approvals => res.json(approvals))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.get('/:secret', async(req, res, next) => {
    Student.findOne({
            secret: req.params.secret,
        })
        .then(async(student) => {
            if (!student) {
                return res.status(404).send({ message: "student Not found." });
            }

            console.log('student here', student)
            if (student.status == true) res.status(400).send('status true');
            else {
                student.status = true;
                await student.save(async(err) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    const id = student._id
                    const university = student.university
                    const department = student.department
                    const name = student.name
                    const email = student.email
                    const phone = student.phone
                    const registration_number = student.registration_number
                    const avatar = student.avatar
                    console.log('link', avatar)
                    const newApprovalS = new ApprovalS({ id, email, name, avatar, phone, registration_number, university, department });
                    try {
                        if (student.activated == true) {
                            res.status(200).send('it has been activated')
                        } else {
                            console.log('new one', newApprovalS, newApprovalS.avatar)
                            await newApprovalS.save();
                            res.status(200).send({ newApprovalS })
                        }
                    } catch (e) {
                        res.status(400).send(e);
                    }

                });
            }
        })
        .catch((e) => console.log("error", e));
})


router.post('/add', async(req, res) => {
    const newApprovalS = new ApprovalS({...req.body });

    try {
        console.log(newApprovalS)
        await newApprovalS.save();
        res.status(200).send({ newApprovalS })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/:id', async(req, res) => {
    try {
        const approvalS = await ApprovalS.findById({ _id: req.params.id })
        if (!approvalS)
            return res.status(404).send()
        res.status(200).send(approvalS)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const approvalS = await ApprovalS.findByIdAndDelete(req.params.id)
        if (!approvalS)
            return res.status(404).send()
        res.status(200).send(approvalS)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router