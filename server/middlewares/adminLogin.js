const jwt = require('jsonwebtoken');
const { User } = require('@models');
const { success, failure } = require('@utils/responses')

module.exports = async (req, res, next) => {
  try {
    const user = req.user

    // 验证是否为管理员
    // if (user.role !== 100) {
    //   throw new Unauthorized('没有权限! ')
    // }

    next()

  } catch (error) {
    failure(res, error)
  }
} 