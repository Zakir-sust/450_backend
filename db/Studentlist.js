const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const uSchema = new Schema({
    registration_number: {
        type: String,
        required: true,
    },
    section_id: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
}, {
    timestamp: true
});

const Studentlist = mongoose.model('Studentlist', uSchema)

module.exports = Studentlist;