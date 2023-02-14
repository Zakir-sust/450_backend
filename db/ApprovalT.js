const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const approveSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    avatar: {
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
    }
}, {
    timestamp: true
});

const ApprovalT = mongoose.model('ApprovalT', approveSchema);

module.exports = ApprovalT;