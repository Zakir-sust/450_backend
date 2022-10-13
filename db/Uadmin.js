const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;


const uadminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    university: {
        type: String,
        unique: true,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamp: true
});

uadminSchema.methods.toJSON = function() {
    const uadmin = this.toObject()
    delete uadmin.password
        /* delete userr.tokens */
    return uadmin;
}

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

uadminSchema.methods.generateAuthToken = async function() {
    const uadmin = this
    console.log('token creation ', uadmin)
    const token = await jwt.sign({ _id: uadmin._id.toString() }, 'thisisnewuadmin')
    console.log('created token ', token)
    uadmin.tokens = uadmin.tokens.concat({ token });
    console.log('token added ', uadmin)
    await uadmin.save()
    return token
}

const ip = require('../ip')

const sendConfirmationEmail = (name, email, secret) => {
    console.log("Check ", secret);
    transport.sendMail({
        from: user,
        to: email,
        subject: "Please confirm your account",
        html: `<div>
          <h1>Email Confirmation</h1>
          <h2>Hello ${name}</h2>
          <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
          <a href=http://${ip}:5000/approve/${secret}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
};

uadminSchema.methods.enter = async function() {
    const uadmin = this
    console.log('logged ', uadmin)
    await uadmin.save((err) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        /*res.send({
            message: "User was registered successfully! Please check your email",
        });*/

        sendConfirmationEmail(
            uadmin.name,
            uadmin.email,
            uadmin.secret
        );
    })
    return uadmin
}


uadminSchema.statics.findByCredentials = async(email, password) => {
    try {
        const uadmin = await UAdmin.findOne({ email })
        if (!uadmin) {
            return -1
        }
        const isMatch = await bcrypt.compare(password, uadmin.password)
        if (!isMatch) {
            return -1
        }
        return uadmin;
    } catch (e) {
        return "Can't log in"
    }
}

uadminSchema.pre('save', async function(next) {
    const UAdmin = this
    console.log('before save ', UAdmin)
    if (UAdmin.isModified('password')) {
        UAdmin.password = await bcrypt.hash(UAdmin.password, 8);
    }
    console.log('are u done ', UAdmin)
    next();
})

const UAdmin = mongoose.model('UAdmin', uadminSchema);

module.exports = UAdmin;