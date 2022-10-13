const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;


const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    activated: {
        type: Boolean,
        required: true
    },
    tokens: [{
        token: {
            _id: false,
            type: String,
            required: true
        }
    }]
}, {
    timestamp: true
});

adminSchema.methods.toJSON = function() {
    const admin = this.toObject()
    delete admin.password
        /* delete userr.tokens */
    return admin;
}

adminSchema.methods.generateAuthToken = async function() {
    const admin = this
    const token = await jwt.sign({ _id: admin._id.toString() }, 'thisisnewadmin')
    admin.tokens = admin.tokens.concat({ token });
    await admin.save()
    return token
}

adminSchema.methods.enter = async function() {
    const admin = this
    console.log('logged ', admin)
    await admin.save()
    return admin
}


adminSchema.statics.findByCredentials = async(email, password) => {
    try {
        const admin = await Admin.findOne({ email })
        if (!admin) {
            return 'user not found'
        }
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return 'pass not matched'
        }
        return admin;
    } catch (e) {
        return "Can't log in"
    }
}

adminSchema.pre('save', async function(next) {
    const Admin = this
    console.log('before save ', Admin)
    if (Admin.isModified('password')) {
        Admin.password = await bcrypt.hash(Admin.password, 8);
    }
    next();
})

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;