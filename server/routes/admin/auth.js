const express = require('express');
const router = express.Router();
const {User} = require('@models');
const { Op } = require('sequelize')
const { BadRequest, Unauthorized, NotFound } = require('http-errors')
const { success, failure } = require('@utils/responses')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/** 
 * 管理员登录
 * POST /admin/signin
 */
router.post('/', async (req, res) => {
  try {
    const { login, password } = req.body
    
    if (!login) {
      throw new BadRequest('用户名或账户名必须填写！')
    }
    if (!password) {
      throw new BadRequest('密码必须填写! ')
    }

    // 设置条件，根据用户名或账户名字段查询
    const condition = {
      where: {
        [Op.or]: [
          { username: login },
          { account: login }
        ]
      }
    }

    const user = await User.findOne(condition)
    if (!user) {
      throw new NotFound('用户不存在！')
    } 

    // 查询到，验证密码
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      throw new Unauthorized('密码错误！')
    }

    // 判断是否是管理员
    if (user.role !== 100) {
      throw new Unauthorized('没有管理员权限！')
    }

    // 生成token
    const token = jwt.sign({
      userId: user.id
    }, process.env.SECRET, { expiresIn: '7d' })

    success(res, 'login success', { token })

  } catch (error) {

    failure(res, error)

  }
})

module.exports = router