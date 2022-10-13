const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const approveSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    university: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    course_id: {
        type: String,
        required: true,
    },
    course_name: {
        type: String,
        required: true
    },
    teacher: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true
    }
}, {
    timestamp: true
});

const ApprovalCo = mongoose.model('ApprovalCo', approveSchema);

module.exports = ApprovalCo;