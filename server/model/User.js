const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phone: { type: String, required: true },
    fullName: { type: String, required: true },
    linkedin: { type: String },
    resume: { type: Buffer },
    resumeContentType: { type: String }
});

module.exports = mongoose.model('User', UserSchema);
