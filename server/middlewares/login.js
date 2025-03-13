const jwt = require('jsonwebtoken');
const { User } = require('@models');
const { Unauthorized } = require('http-errors')
const { success, failure } = require('@utils/responses')

module.exports = async (req, res, next) => {
  try {
    // 判断Token是否存在 
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      throw new Unauthorized('authorization field missing')
    }
    const token = authHeader.split(' ')[1]; // Bearer token 格式 => "Bearer <token>"
    if (!token) {
      throw new Unauthorized('token missing')
    }

    // token是否正确
    const decoded = jwt.verify(token, process.env.SECRET)

    // jwt 解析出
    const { userId } = decoded

    // 查询用户
    const user = await User.findByPk(userId)
    if (!user) {
      throw new Unauthorized('用户不存在！')
    }

    // 通过验证，则将解析出的user对象挂载到req上，以供后续中间件使用
    req.user = user

    next()

  } catch (error) {
    failure(res, error)
  }
} 