const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 10;


const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    registration_number: {
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
    session: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    activated: {
        type: Boolean,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    secret: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
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

studentSchema.methods.toJSON = function() {
    const student = this.toObject()
    delete student.password
        /* delete userr.tokens */
    return student;
}

studentSchema.methods.generateAuthToken = async function() {
    const student = this
    const token = await jwt.sign({ _id: student._id.toString() }, 'thisisnewstudent')
    student.tokens = student.tokens.concat({ token });
    await student.save()
    return token;
}

studentSchema.methods.enter = async function() {
    const student = this
    console.log('logged enter ', student)
    await student.save()
    return student
}




studentSchema.statics.findByCredentials = async(email, password) => {
    try {
        const student = await Student.findOne({ email })
        if (!student) {
            return -1
        }
        console.log('student ', student)
        console.log(password, student.password)
        const isMatch = await bcrypt.compare(password, student.password)
        if (!isMatch) {
            console.log('not matched')
            return -1
        } else { console.log('matched') }
        return student;
    } catch (e) {
        return "Can't log in"
    }
}

studentSchema.pre('save', async function(next) {
    const Student = this
    if (Student.isModified('password')) {
        Student.password = await bcrypt.hash(Student.password, 8);
    }
    next();
})

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;