const express = require('express');
const router = express.Router();
const {User} = require('@models');
const { Op } = require('sequelize')
const { BadRequest, Unauthorized, NotFound } = require('http-errors')
const { success, failure } = require('@utils/responses')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/** 
 * 用户注册
 * POST /signup
 */
router.post('/signup', async (req, res) => {
  try {
    const body = {
      username: req.body.username,
      account: req.body.account,
      password: req.body.password,
      gender: 99,
      role: 0,
      status: 0
    }

    const user = await User.create(body)
    delete user.dataValues.password   // sequelize中的固定用法，删除密码字段以免前台看到密码

    success(res, '注册成功！', {}, 201)

  } catch (error) {
    failure(res, error)
  }
})


/** 
 * 用户登陆
 * POST /signin
 */
router.post('/signin', async (req, res) => {
  try {
    const { login, password } = req.body
    
    if (!login) {
      throw new BadRequest('用户名或账户名必须填写！')
    }
    if (!password) {
      throw new BadRequest('密码必须填写! ')
    }

    // 设置条件，用户名和账户名查询到其中一个就匹配成功并返回
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

    // 生成token
    const token = jwt.sign({
      userId: user.id
    }, process.env.SECRET, { expiresIn: '7d' })

    success(res, '登录成功！', { token })

  } catch (error) {

    failure(res, error)

  }
})

module.exports = router