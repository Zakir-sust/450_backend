const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    date: {
        type: String,
        required: true,
    },
    course_id: {
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
    course_name: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    record: [{
        registration_number: {
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

const Bydate = mongoose.model('Bydate', uSchema);

module.exports = Bydate;