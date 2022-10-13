const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;


const dheadSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true

    },
    secret: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    avatar: {
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

dheadSchema.methods.toJSON = function() {
    const dhead = this.toObject()
    delete dhead.password
        /* delete userr.tokens */
    return dhead;
}

dheadSchema.methods.generateAuthToken = async function() {
    const dhead = this
    const token = await jwt.sign({ _id: dhead._id.toString() }, 'thisisnewdhead')
    dhead.tokens = dhead.tokens.concat({ token });
    await dhead.save()
    return token
}

dheadSchema.methods.enter = async function() {
    const dhead = this
    console.log('logged ', dhead)
    await dhead.save()
    return dhead
}


dheadSchema.statics.findByCredentials = async(email, password) => {
    try {
        const dhead = await Dhead.findOne({ email })
        if (!dhead) {
            return -1
        }
        const isMatch = await bcrypt.compare(password, dhead.password)
        if (!isMatch) {
            return -1
        }
        return dhead;
    } catch (e) {
        return "Can't log in"
    }
}

dheadSchema.pre('save', async function(next) {
    const Dhead = this
    console.log('before save ', Dhead)
    if (Dhead.isModified('password')) {
        Dhead.password = await bcrypt.hash(Dhead.password, 8);
    }
    next();
})

const Dhead = mongoose.model('Dhead', dheadSchema);

module.exports = Dhead;