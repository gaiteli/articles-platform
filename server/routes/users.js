const express = require('express');
const router = express.Router();
const {User} = require('@models');
const { Op } = require('sequelize')
const { NotFound } = require('http-errors')
const { success, failure } = require('@utils/responses')

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
 * 更新用户信息
 */
// router.put()

/*
 * 公共方法：查询当前用户
 */
async function getUser(req, isShowPassword = false) {
  // 获取用户ID
  const id = req.user.id

  // 是否显示密码
  let condition = {}
  if (!isShowPassword) {
    condition = {
      attributes: { exclude: ['password'] },
    }
  }

  // 查询当前用户
  const user = await User.findByPk(id, condition)

  // 如果没有找到，就抛出异常
  if (!user) {
    throw new NotFound(`没有找到ID为${ id }的用户`)
  }

  // 找到用户，返回
  return user
}

module.exports = router;