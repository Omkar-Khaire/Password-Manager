const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createCredential,
  getCredentials,
  getCredential,
  updateCredential,
  deleteCredential,
} = require('../controllers/credentialsController');

// All credential routes protected - require authentication
router.post('/', auth, [
  check('websiteName', 'Website name is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty(),
], createCredential);

router.get('/', auth, getCredentials);
router.get('/:id', auth, getCredential);

router.put('/:id', auth, [
  check('websiteName', 'Website name is required').not().isEmpty(),
], updateCredential);

router.delete('/:id', auth, deleteCredential);

module.exports = router;