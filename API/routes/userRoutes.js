const { Router } = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

const router = Router();

router.get('/', auth.isLoggedIn, auth.isSuperUser, userController.getUsers);
router.get('/:userID', auth.isLoggedIn, auth.isSuperUser, userController.getUserById);
router.post('/', userController.createUser);
router.post('/login', userController.login);
router.patch('/:userID', auth.isLoggedIn, userController.updateUser);
router.delete('/:userID', auth.isLoggedIn, userController.deleteUser);

module.exports = router;
