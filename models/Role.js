const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        default: 'public',
        enum: ['public', 'private']
    },
})

module.exports = mongoose.model('Role', RoleSchema);