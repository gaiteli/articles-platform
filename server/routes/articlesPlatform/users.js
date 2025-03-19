const express = require('express');
const router = express.Router();
const {NotFound} = require('http-errors');
const authController = require('@controllers/authController');
const { success, failure } = require('@utils/responses')
const {User} = require('@models');

/**
 * 查询当前登陆用户
 */
router.get('/me', async function(req, res, next) {
  try {
    const user = await getUser(req)
    success(res, '查询当前用户信息成功。', {user})
  } catch(error) {
    failure(res, error)
  }
});


/**
 * 获取权限
 * GET /permissions
 */
router.get('/permissions', authController.getPermissions);


/**
 * 公共方法：查询当前用户
 */
async function getUser(req,isShowPassword = false) {
  const id = req.user.id

  let condition = {}
  if (isShowPassword) {
    condition = {
      attributes: { exclude: ['password'] }
    }
  }

  const user = await User.findByPk(id, condition)

  if (!user) {
    throw new NotFound(`没有找到ID为${id}的用户`)
  }

  return user
}


module.exports = router;