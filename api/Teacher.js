let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    uuidv4 = require('uuid/v4'),
    router = express.Router();
const Teacher = require('../db/Teacher');
const authTeacher = require('../middleware/authTeacher')
const cloudinary = require('../helper/imageUpload')
const DIR = './public/';
const ApprovalT = require('../db/ApprovalT')
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;


router.use(express.json())
router.route('/').get((req, res) => {
    const university = req.query.university
    const department = req.query.department
    Teacher.find({ university: university, department: department })
        .then(teachers => res.json(teachers))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.get('/me', authTeacher, async(req, res) => {
    try {
        console.log(req.teacher)
        res.status(200).send(req.teacher)
    } catch (e) {
        res.status(500).send()
    }
})

const nodemailer = require("nodemailer");
const config = require("../config");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: user,
        pass: pass,
    },
});

const ip = require('../ip')

const sendConfirmationEmail = (name, email, secret) => {
    console.log("Check ", secret, user, email, pass);
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account",
        html: `<div>
          <h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <p>http://localhost:5000/approveT/${secret}</p>
          </div>`,
    }).catch(async(err) => {
        console.log('error occurred', err)
    });
};

// const storage = multer.diskStorage({});

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb('invalid image file!', false);
//     }
// };
// const upload = multer({ storage, fileFilter });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// add this just
const sendPasswordUpdateEmail = (email, password, post, secret, name) => {
    console.log("Check ", secret, user, email, pass);
    transport.sendMail({
        from: user,
        to: email,
        subject: "Password Changing Alert",
        html: `
        <html>
          <body>
          <h1>Hello ${name}</h1>
          <h2>Click the link below to change your password. If you have not asked to change your password then ignore this mail</h2>
          <p>http://localhost:5000/${post}/${password}/${secret}</p>
          </body>
        </html>`,
    }).catch(err => {
        console.log('err', err)
    });
};
const bcrypt = require('bcryptjs');
router.get('/:password/:secret', async(req, res) => {
    let f = 0
    const psw = await bcrypt.hash(req.params.password, 8);

    try {
        const ress = await Teacher.findOne({ secret: req.params.secret }) // 1 change
        console.log('donee', ress)
        const pass = { password: psw }
        const teacher = await Teacher.findByIdAndUpdate(ress._id, pass, { new: true, runValidators: true }) //2 change

        console.log('result which I wanted to observe', teacher) //1 change
        res.status(200).send(teacher) //1 change
        if (res != null) console.log('got one')
        f = 1
    } catch (e) {
        console.log('teacher doesss not exit', e) //1 change
    }

})
router.post('/pass', async(req, res) => {
    const email = req.body.email
    const post = req.body.post
    const password = req.body.password
    console.log(req.body.email, post, password)
    let teacher //1 change
    let f = 0

    try {
        const res = await Teacher.findOne({ email: email }) //1 chnage
        teacher = res //1 change
        console.log('result which I want to observe', res)
        if (res != null) console.log('got one')
        f = 1
    } catch (e) {
        console.log('teacher does not exit', e) //1 change
    }
    // console.log('fff', f)
    if (!f) {
        console.log('ft', f)
        res.status(200).send('teacher exists') //1 change
        return
    }
    try {
        sendPasswordUpdateEmail(
            teacher.email,
            password,
            teacher.post,
            teacher.secret,
            teacher.name,
        ); // 4 chnages

        console.log('Teacher', teacher) //2 chnages
        res.status(200).send(teacher) //2 changes
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e);
    }

})



router.post('/add', upload.single('avatar'), async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const university = req.body.university;
    const department = req.body.department;
    const password = req.body.password;
    const post = 'teacher'
    const activated = false
    const status = false
    const secret = await jwt.sign({ email: email }, 'thisisnewteacher')
    const url = req.protocol + '://' + req.get('host')
    const avatar = url + '/public/' + req.file.filename
    let f = 0

    try {
        const res = await Teacher.findOne({ email: email })
        console.log('result which I want to observe', res)
        if (res != null) console.log('got one')
        if (res != null) {
            f = 1
        }
    } catch (e) {
        console.log('teacher is used', e)
    }
    // console.log('fff', f)
    if (f) {
        console.log('ft', f)
        res.status(200).send('teacher exists')
        return
    }

    let newTeacher = new Teacher({ email, name, phone, university, secret, department, avatar, post, status, activated, password });
    console.log('new ', newTeacher)

    try {
        await newTeacher.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            console.log('sending mail')

            sendConfirmationEmail(
                newTeacher.name,
                newTeacher.email,
                newTeacher.secret
            );
        })
        console.log('Teacher', newTeacher)
        res.status(200).send(newTeacher)
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e);
    }
})

router.patch('/avatar/:id', upload.single('avatar'), async(req, res) => {
    const url = req.protocol + '://' + req.get('host')
    const avatar = url + '/public/' + req.file.filename
    const object = { avatar: avatar }
    try {
        console.log(avatar, req.params.id)
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, object, { new: true, runValidators: true })
        if (!teacher)
            return res.status(404).send()
        res.status(200).send(teacher)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/addd', upload.single('avatar'), async(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const university = req.body.university;
    const department = req.body.department;
    const password = req.body.password;
    const post = 'teacher'
    const activated = true
    const status = true
    const secret = await jwt.sign({ email: email }, 'thisisnewteacher')
    console.log(name, email, university, department)
    let f = 0

    try {
        const res = await Teacher.findOne({ email: email })
        console.log('result which I want to observe', res)
        if (res != null) console.log('got one')
        if (res != null) {
            f = 1
        }
    } catch (e) {
        console.log('teacher is used', e)
    }
    // console.log('fff', f)
    if (f) {
        console.log('ft', f)
        res.status(200).send('teacher exists')
        return
    }
    let image
    try {
        image = await cloudinary.uploader.upload(req.file.path, {
            public_id: `${secret}_profile`,
            width: 100,
            height: 100,
            crop: 'fill',
        });
        console.log('image', image)
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: 'server error, try after some time' });
        console.log('Error while uploading profile image', error.message);
    }
    const avatar = image.url
    let newTeacher = new Teacher({ email, name, phone, university, secret, department, avatar, post, status, activated, password });
    console.log('new ', newTeacher)

    try {
        await newTeacher.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
        })
        console.log('Teacher', newTeacher)
        res.status(200).send(newTeacher)
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e);
    }
})


router.route('/login').post(async(req, res) => {
    try {
        let teacher = await Teacher.findByCredentials(req.body.email, req.body.password)
        console.log('got a teacher', teacher)
        if (teacher == -1) {
            console.log(teacher)
            res.status(403).send('Email or Password not matched')
        }
        if (teacher.activated == false) {
            console.log('not activated')
            res.status(403).send('Id is not activated')
            return
        } else {
            const token = await teacher.generateAuthToken()
            const post = teacher.post
            const university = teacher.university
            const department = teacher.department
            const name = teacher.name
            const email = teacher.email
            const id = teacher._id
            const avatar = teacher.avatar
            console.log(teacher)
            res.status(200).send({ teacher, token, post, department, university, name, avatar, email, id })
        }
    } catch (e) {
        console.log(e.message)
        res.status(400).json(e)
    }
})

router.get('/logout', authTeacher, async(req, res) => {
    console.log(req.teacher)
    try {
        req.teacher.tokens = req.teacher.tokens.filter(token => token.token !== req.token)
            //req.user.tokens = []
        await req.teacher.save();
        res.status(200).send(req.teacher)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/:id', async(req, res) => {
    console.log(req.params)
    try {
        const teacher = await Teacher.findById(req.params.id)
        if (!teacher)
            return res.status(404).send()
        res.status(200).send(teacher)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.patch('/:id', async(req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!teacher)
            return res.status(404).send()
        res.status(200).send(teacher)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/:id', async(req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id)
        if (!teacher)
            return res.status(404).send()
        res.status(200).send(teacher)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router;