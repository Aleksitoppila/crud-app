// SCHEMA FOR DATABASE OBJECTS
const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    contributor: {
        type: String,
        required: true,
    },
    projectLink: {
        type: String,
        required: true

    }
});

module.exports = mongoose.model('Projects', ProjectSchema)