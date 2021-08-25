const { Router } = require('express');
const auth = require('../middleware/auth');
const todoListController = require('../controllers/todoListController');

const router = Router();

module.exports = router;
