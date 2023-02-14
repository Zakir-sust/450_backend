const express = require('express')
const router = express.Router();
const Admin = require('../db/Admin');
const authAdmin = require('../middleware/authAdmin');
const auth = require('../middleware/authAdmin')

router.use(express.json())
router.route('/').get((req, res) => {
    Admin.find()
        .then(admins => res.json(admins))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.get('/me', authAdmin, async(req, res) => {
    try {
        res.status(200).send(req.admin)
    } catch (e) {
        res.status(500).send()
    }
})


router.post('/add', async(req, res) => {
    const phone = req.body.phone;
    const email = req.body.email;
    const activated = true;
    const post = 'admin'
    const password = req.body.password;

    try {
        Admin.findOne({ email: email }, function(err, admin) {
            console.log('exist ', admin);
            if (admin) return
        })
    } catch {
        console.log('admin is used')
    }

    const newAdmin = new Admin({ email, phone, post, password, activated });
    console.log(newAdmin)

    try {
        const token = await newAdmin.generateAuthToken();
        console.log('token', token)
        res.status(200).send({ newAdmin, token })
    } catch (e) {
        console.log('error is ', e.message)
        res.status(400).send(e);
    }
})

router.route('/login').post(async(req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        console.log('admin ', admin)
        console.log('token ', admin.token)
        const post = admin.post
        const email = admin.email
        const name = 'admin'
        res.status(200).send({ admin, token, post, email, name })
    } catch (e) {
        res.status(400).json(e)
    }
})

router.get('/logout', authAdmin, async(req, res) => {
    console.log(req.admin)
    try {
        req.admin.tokens = req.admin.tokens.filter(token => token.token !== req.token)
            //req.user.tokens = []
        await req.admin.save();
        res.status(200).send(req.admin)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:id', async(req, res) => {
    console.log(req.params)
    try {
        const admin = await Admin.findById(req.params.id)
        if (!admin)
            return res.status(404).send()
        res.status(200).send(admin)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/:id', async(req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!admin)
            return res.status(404).send()
        res.status(200).send(admin)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/:id', async(req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id)
        if (!admin)
            return res.status(404).send()
        res.status(200).send(admin)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router;