const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


/** 
 * 用户注册
 * POST /register
 */
router.post('/register', authController.register);


/** 
 * 用户登陆
 * POST /login
 */
router.post('/login', authController.login);


module.exports = router