const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const validateCaptcha = require('@middlewares/validateCaptcha')

/** 
 * 用户注册
 * POST /register
 */
router.post('/register', validateCaptcha, authController.register);


/** 
 * 用户登陆
 * POST /login
 */
router.post('/login', validateCaptcha, authController.login);


/**
 * 验证邮箱
 * GET /verify-email
 */
router.get('/verify-email', authController.verifyEmail);

/**
 * 重新发送验证邮件
 * POST /resend-verification
 */
router.post('/resend-verification', authController.resendVerification);

/**
 * 忘记密码 - 发送重置邮件
 * POST /auth/forgot-password
 */
router.post('/forgot-password', validateCaptcha, authController.forgotPassword);

/**
 * 重置密码
 * POST /auth/reset-password
 */
router.post('/reset-password', authController.resetPassword);

/**
 * 验证重置密码token
 * GET /auth/validate-reset-token
 */
router.get('/validate-reset-token', authController.validateResetToken);


module.exports = router