const express = require('express');
const router = express.Router();
const { success,failure } = require('@utils/responses');
const svgCaptcha = require('svg-captcha');
const { setKey } = require('@utils/redis');
const { v4: uuidv4 } = require('uuid');

/**
 * 获取验证码
 * GET /captcha
 */
router.get('/', async (req, res) => {
  try {
    const captcha = svgCaptcha.create({
      size: 4,                    // 验证码长度位数
      ignoreChars: '0o1il9quv',   // 字符排除难以区分的
      noise: 3,                   // 干扰线条数量
      color: true,                // 是否有颜色
      width: 100,
      height: 40
    })
    // 或使用createMathExpr方法用数学计算形式

    // 将验证码存入redis
    const captchaKey = `captcha:${uuidv4()}`;
    await setKey(captchaKey, captcha.text, 60*10);

    success(res, '验证码获取成功', {
      captchaKey,
      captchaData: captcha.data,
    })
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;