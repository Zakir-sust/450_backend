const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;


const teacherSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
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
    post: {
        type: String,
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
    password: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true
    },
    avatar: {
        type: String,
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

teacherSchema.methods.toJSON = function() {
    const teacher = this.toObject()
    delete teacher.password
        /* delete userr.tokens */
    return teacher;
}

teacherSchema.methods.generateAuthToken = async function() {
    let teacher = this
    console.log(teacher)
    const token = await jwt.sign({ _id: teacher._id.toString() }, 'thisisnewteacher')
    teacher.tokens = teacher.tokens.concat({ token });
    console.log(teacher.tokens)
    console.log('againn', teacher)
    await teacher.save()
    console.log('serach tokn ', token)
    return token;
}

teacherSchema.methods.enter = async function() {
    const teacher = this
    console.log('logged enter ', teacher)
    await teacher.save()
    return teacher
}




teacherSchema.statics.findByCredentials = async(email, password) => {
    try {
        const teacher = await Teacher.findOne({ email })
        if (!teacher) {
            return -1
        }
        const isMatch = await bcrypt.compare(password, teacher.password)
        if (!isMatch) {
            return -1
        }
        return teacher;
    } catch (e) {
        return "Can't log in"
    }
}

teacherSchema.pre('save', async function(next) {
    const Teacher = this
    console.log('again ', Teacher)
    console.log(Teacher.isModified('password'))
    if (Teacher.isModified('password')) {
        Teacher.password = await bcrypt.hash(Teacher.password, 8);
    }
    next();
})

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;