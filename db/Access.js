const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const accessSchema = new Schema({
    course_id: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    teacher: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    registration_number: {
        type: String,
        required: true,
    },
    course_name: {
        type: String,
        required: true,
    },
    university: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true
    },
}, {
    timestamp: true
});

const Access = mongoose.model('Access', accessSchema);

module.exports = Access;