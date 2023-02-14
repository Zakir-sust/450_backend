const express = require('express')
const router = express.Router();
const Byreg = require('../db/Byreg')

router.use(express.json())

router.route('/').get((req, res) => {
    Byreg.find()
        .then(byreg => res.json(byreg))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/srro').get((req, res) => {
    const course_id = req.query.course_id;
    const section = req.query.section;
    const registration_number = req.query.registration_number;
    Byreg.findOne({ course_id: course_id, section: section, registration_number: registration_number })
        .then(byreg => res.status(200).json(byreg))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/srr').get((req, res) => {
    const course_id = req.query.course_id;
    const section = req.query.section;
    Byreg.find({ course_id: course_id, section: section })
        .then(byreg => res.status(200).json(byreg))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/sr').patch((req, res) => {
    const course_id = req.query.course_id;
    const section = req.query.section;
    const registration_number = req.query.registration_number;
    Byreg.find({ course_id: course_id, section: section, registration_number: registration_number })
        .then(byreg => {
            console.log('by registration', byreg)
            byreg.map(async br => {
                arr = br.record
                console.log('arr', arr, req.body)
                arr = arr.filter(ele => req.body.date != ele.date)
                arr.push(req.body)
                console.log(arr)
                const chg = { record: arr }
                console.log('chg', chg, br._id)
                try {
                    const bg = await Byreg.findByIdAndUpdate(br._id, chg, { new: true, runValidators: true })
                    if (!bg)
                        return res.status(404).send()
                    res.status(200).send(bg)
                } catch (e) {
                    res.status(500).send(e.message)
                }
            })
        })
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/regd').patch((req, res) => {
    const course_id = req.query.course_id;
    const section = req.query.section;
    Byreg.find({ course_id: course_id, section: section })
        .then(byreg => {
            console.log('by registration', byreg)
            byreg.map(async br => {
                arr = br.record
                console.log('arr', arr, req.body)
                arr = arr.filter(ele => req.body.date != ele.date)
                console.log(arr)
                const chg = { record: arr }
                console.log('chg', chg, br._id)
                try {
                    const bg = await Byreg.findByIdAndUpdate(br._id, chg, { new: true, runValidators: true })
                    if (!bg)
                        return res.status(404).send()
                    res.status(200).send(bg)
                } catch (e) {
                    res.status(500).send(e.message)
                }
            })
        })
        .catch(err => res.status(400).json('Error: ' + err));
})




router.route('/srd').patch((req, res) => {
    const course_id = req.query.course_id;
    const section = req.query.section;
    const registration_number = req.query.registration_number;
    Byreg.find({ course_id: course_id, section: section, registration_number: registration_number })
        .then(byreg => {
            console.log('by registration', byreg)
            byreg.map(async br => {
                arr = br.record
                console.log('arr', arr, req.body)
                arr = arr.filter(ele => req.body.date != ele.date)
                console.log(arr)
                const chg = { record: arr }
                console.log('chg', chg, br._id)
                try {
                    const bg = await Byreg.findByIdAndUpdate(br._id, chg, { new: true, runValidators: true })
                    if (!bg)
                        return res.status(404).send()
                    res.status(200).send(bg)
                } catch (e) {
                    res.status(500).send(e.message)
                }
            })
        })
        .catch(err => res.status(400).json('Error: ' + err));
})


router.post('/add', async(req, res) => {
    const byreg = new Byreg({...req.body });

    try {
        console.log(byreg)
        await byreg.save();
        res.status(200).send({ byreg })
    } catch (e) {
        res.status(400).send(e);
    }
})



router.get('/:id', async(req, res) => {
    try {
        const byreg = await Byreg.findById({ _id: req.params.id })
        if (!byreg)
            return res.status(404).send()
        res.status(200).send(byreg)
    } catch (e) {
        res.status(400).send()
    }
})

router.patch('/:id', async(req, res) => {

    try {
        const byreg = await Byreg.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!byreg)
            return res.status(404).send()
        res.status(200).send(byreg)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/dt/:id', async(req, res) => {
    let arr = []
    try {
        const byreg = await Byreg.findById({ _id: req.params.id })
        if (!byreg)
            return res.status(404).send()
        arr = byreg.record
        console.log('arr', arr)
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }

    arr.push(req.body)
    console.log('arr ', arr)

    const chg = { record: arr }

    console.log(chg)

    try {
        const byreg = await Byreg.findByIdAndUpdate(req.params.id, chg, { new: true, runValidators: true })
        if (!byreg)
            return res.status(404).send()
        res.status(200).send(byreg)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/del', async(req, res) => {
    const course_id = req.query.course_id
    const registration_number = req.query.registration_number
    try {
        const byreg = await Byreg.findOne({ course_id: course_id, registration_number: registration_number })
        const byr = await Byreg.findByIdAndDelete(byreg._id)
        if (!byr)
            return res.status(404).send()
        res.status(200).send(byr)

    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const byreg = await Byreg.findByIdAndDelete(req.params.id)
        if (!byreg)
            return res.status(404).send()
        res.status(200).send(byreg)

    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router