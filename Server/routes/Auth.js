const express = require('express');
const { createUser, loginUser, UserList, getUserById, updateUserProfile, forgotPassword, resetPassword, resetPasswordPost} = require('../controller/Auth');
const {authenticate, authorize} = require('../middlware/authenticate');
const router = express.Router();

router.post('/signup', createUser);
router.post('/login', loginUser);
router.get('/userList', authenticate, authorize(['teacher']), UserList);
router.get('/:id', authenticate, authorize(['teacher', 'student']), getUserById);
router.put('/updateProfile/:id', authenticate, authorize(['teacher', 'student']), updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:id/:token', resetPassword);
router.post('/reset-password/:id/:token', resetPasswordPost)
module.exports = router;
