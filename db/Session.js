const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    session: {
        type: String,
        required: true,
    },
    university: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
}, {
    timestamp: true
});

const Session = mongoose.model('Session', uSchema);

module.exports = Session;