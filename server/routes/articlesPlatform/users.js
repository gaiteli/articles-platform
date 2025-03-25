const express = require('express');
const router = express.Router();
const {NotFound, Forbidden} = require('http-errors');
const authController = require('@controllers/authController');
const { success, failure } = require('@utils/responses')
const {User} = require('@models');
const {ROLE_PERMISSIONS} = require("../../constants/permissions");

/**
 * 查询当前登陆用户
 */
router.get('/me', async function(req, res, next) {
  try {
    const user = await getUser(req)
    success(res, '查询当前用户信息成功。', {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: ROLE_PERMISSIONS[user.role] || [],
        bgImageUrl: user.bgImageUrl,
      }
    })
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
 * 更新该用户文章平台首页背景图
 * PUT /background
 */
router.put('/background', async function (req, res) {
  try {
    const user = await getUser(req)

    const { bgImageUrl } = req.body;

    // 更新文章内容
    const body = {
      bgImageUrl: bgImageUrl || null,
    };

    await user.update(body);
    success(res, '平台首页背景图更换成功');
  } catch (error) {
    failure(res, error);
  }
})

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