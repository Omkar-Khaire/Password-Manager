const { validationResult } = require('express-validator');
const Credential = require('../models/Credential');
const { encrypt, decrypt } = require('../utils/crypto');

// POST /api/credentials - Create credential
exports.createCredential = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { websiteName, websiteUrl, username, password, notes } = req.body;
  const userId = req.user._id; // From auth middleware - verified JWT

  try {
    // ENCRYPT password before storing
    const encryptedPassword = encrypt(password);

    const credential = new Credential({
      userId,
      websiteName,
      websiteUrl: websiteUrl || null,
      username: username || null,
      password: encryptedPassword,
      notes: notes || null,
    });

    await credential.save();
    // Return credential with DECRYPTED password (user is authenticated)
    res.status(201).json({
      credential: {
        _id: credential._id,
        userId: credential.userId,
        websiteName: credential.websiteName,
        websiteUrl: credential.websiteUrl,
        username: credential.username,
        password: decrypt(credential.password),
        notes: credential.notes,
        createdAt: credential.createdAt,
        updatedAt: credential.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/credentials - List user's credentials
exports.getCredentials = async (req, res) => {
  const userId = req.user._id; // From auth middleware

  try {
    const credentials = await Credential.find({ userId });
    // Decrypt passwords for the authenticated user
    const decrypted = credentials.map(c => ({
      _id: c._id,
      userId: c.userId,
      websiteName: c.websiteName,
      websiteUrl: c.websiteUrl,
      username: c.username,
      password: decrypt(c.password),
      notes: c.notes,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
    res.json({ credentials: decrypted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/credentials/:id - Get single credential
exports.getCredential = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const credential = await Credential.findById(id);
    if (!credential) return res.status(404).json({ error: 'Credential not found' });

    // Authorization: only owner can view
    if (credential.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({
      credential: {
        _id: credential._id,
        userId: credential.userId,
        websiteName: credential.websiteName,
        websiteUrl: credential.websiteUrl,
        username: credential.username,
        password: decrypt(credential.password),
        notes: credential.notes,
        createdAt: credential.createdAt,
        updatedAt: credential.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/credentials/:id - Update credential
exports.updateCredential = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { id } = req.params;
  const userId = req.user._id;
  const { websiteName, websiteUrl, username, password, notes } = req.body;

  try {
    let credential = await Credential.findById(id);
    if (!credential) return res.status(404).json({ error: 'Credential not found' });

    // Authorization: only owner can edit
    if (credential.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update fields
    credential.websiteName = websiteName || credential.websiteName;
    credential.websiteUrl = websiteUrl !== undefined ? websiteUrl : credential.websiteUrl;
    credential.username = username !== undefined ? username : credential.username;
    if (password) credential.password = encrypt(password);
    credential.notes = notes !== undefined ? notes : credential.notes;

    await credential.save();

    res.json({
      credential: {
        _id: credential._id,
        userId: credential.userId,
        websiteName: credential.websiteName,
        websiteUrl: credential.websiteUrl,
        username: credential.username,
        password: decrypt(credential.password),
        notes: credential.notes,
        createdAt: credential.createdAt,
        updatedAt: credential.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/credentials/:id - Delete credential
exports.deleteCredential = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const credential = await Credential.findById(id);
    if (!credential) return res.status(404).json({ error: 'Credential not found' });

    // Authorization: only owner can delete
    if (credential.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Credential.findByIdAndDelete(id);
    res.json({ message: 'Credential deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};