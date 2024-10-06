// user.routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

// User routes
router.post('/signup', userController.createUser);
router.get('/login',userController.login)
router.get('/users',authMiddleware, userController.getAllUsers);
router.get('/users/:id',authMiddleware, userController.getUserById);
router.put('/users/update/:id',authMiddleware, userController.updateUser);
router.delete('/users/delete/:id', authMiddleware,userController.deleteUser);

module.exports = router;
