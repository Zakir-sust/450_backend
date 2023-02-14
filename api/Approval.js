const express = require('express')
const router = express.Router();
const Approval = require('../db/Approval')
const UAdmin = require('../db/Uadmin')

router.use(express.json())

router.route('/').get((req, res) => {
    Approval.find()
        .then(approvals => res.json(approvals))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.post('/add', async(req, res) => {
    const newApproval = new Approval({...req.body });

    try {
        console.log(newApproval)
        await newApproval.save();
        res.status(200).send({ newApproval })
    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/:secret', async(req, res, next) => {
    UAdmin.findOne({
            secret: req.params.secret,
        })
        .then(async(uadmin) => {
            console.log('uadmin in secret approve', uadmin)
            if (!uadmin) {
                return res.status(404).send({ message: "University Admin Not found." });
            }

            if (uadmin.status == true) res.status(400).send('status true')
            else {

                uadmin.status = true;
                await uadmin.save(async(err) => {
                    if (err) {
                        console.log('err occurred here in secret approve')
                        res.status(500).send({ message: err });
                        return;
                    }
                    const id = uadmin._id
                    const university = uadmin.university
                    const email = uadmin.email
                    const name = uadmin.name
                    const phone = uadmin.phone
                    const avatar = uadmin.avatar
                    const newApproval = new Approval({ id, university, email, name, phone, avatar });
                    try {
                        if (uadmin.activated == true) res.status(400).send('already activated')
                        else {
                            console.log(newApproval)
                            await newApproval.save();
                            res.status(200).send({ newApproval })
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
        const approval = await Approval.findById({ _id: req.params.id })
        if (!approval)
            return res.status(404).send()
        res.status(200).send(approval)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const approval = await Approval.findByIdAndDelete(req.params.id)
        if (!approval)
            return res.status(404).send()
        res.status(200).send(approval)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router