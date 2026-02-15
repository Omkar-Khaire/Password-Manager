const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  websiteName: { type: String, required: true },
  websiteUrl: { type: String },
  username: { type: String },
  password: { type: String, required: true }, // ENCRYPTED string
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Credential', CredentialSchema);