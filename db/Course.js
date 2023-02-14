const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    session_id: {
        type: String,
        required: true,
    },
    session: {
        type: String,
        required: true
    },
    university: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    teacher_id: {
        type: String,
        required: true
    },
    section: [{
        section: {
            type: String,
            required: true
        }
    }],
    record: [{
        date: {
            type: String,
            required: true
        },
        section: {
            type: String,
            required: true
        }
    }],
    collaborator: [{
        id: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    }],
    student: [{
        id: {
            type: String,
            required: true
        },
        registration_number: {
            type: String,
            required: true
        },
        section: {
            type: String,
            required: true
        },
        session: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    }]
}, {
    timestamp: true
});

const Course = mongoose.model('Course', uSchema);

module.exports = Course;