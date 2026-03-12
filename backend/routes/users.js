const express = require('express');
const router = express.Router();
// تأكد أن المسار هنا يشير للملف الذي يحتوي على دالة register و login
const userController = require('../controllers/adminController'); 

// مسار التسجيل: سيصبح الرابط http://localhost:5000/api/users/register
router.post('/register', userController.register);

// مسار الدخول: سيصبح الرابط http://localhost:5000/api/users/login
router.post('/login', userController.login);

module.exports = router;