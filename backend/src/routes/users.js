const express = require('express');
const { getUsers } = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getUsers);

module.exports = router; 