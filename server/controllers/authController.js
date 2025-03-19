const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const {BadRequest, Unauthorized, NotFound} = require("http-errors");

const { User } = require('@models')
const {ROLE_PERMISSIONS} = require("../constants/permissions");
const { success, failure } = require('@utils/responses')


/* 注册 register */
exports.register = async (req, res) => {
  try {
    const body = {
      username: req.body.username,
      account: req.body.account,
      password: req.body.password,
      gender: 99,
      role: 'user',
      status: 'inactive',
    }

    const user = await User.create(body)
    delete user.dataValues.password   // sequelize中的固定用法，删除密码字段以免前台看到密码

    success(res, '注册成功！', {}, 201)

  } catch (error) {
    failure(res, error)
  }
}


/* 登陆 login */
exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // 用户名、密码判空
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

    // 查找用户
    const user = await User.findOne(condition);
    if (!user) {
      throw new NotFound('用户不存在！')
    }

    // 查询到，验证密码
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      throw new Unauthorized('密码错误！')
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET,
      { expiresIn: '24h' }
    );

    success(res, '登陆成功！', {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role // 只返回角色
      }
    })

  } catch (error) {
    failure(res, error, '登陆遇到错误！');
  }
};


/* 权限获取接口 getPermissions */
exports.getPermissions = async (req, res) => {
  try {
    const { role } = req.query;
    const permissions = ROLE_PERMISSIONS[role] || [];
    success(res, '获取权限信息成功！', { permissions });
  } catch (error) {
    failure(res, error, '获取权限失败');
  }
};
