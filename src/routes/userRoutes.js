const express = require('express');
const { registerUser, getUsers, deleteUser, updateUser, getUserById, loginUser, logoutUser  } = require('../controllers/userController');
const validate = require('../middleware/validationMiddleware');
const { userSchema } = require('../validation/userValidation');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/users/login', loginUser);
router.post('/users/logout', protect, logoutUser);
router.post('/users/register', validate(userSchema), registerUser);
router.get('/users/', protect, getUsers);
router.delete('/users/:id', protect, deleteUser);
router.put('/users/:id', protect, updateUser);
router.get('/users/:id', protect, getUserById);

module.exports = router;