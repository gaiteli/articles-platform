const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')
const {BadRequest, Unauthorized, NotFound} = require("http-errors");

const {User} = require('@models')
const {ROLE_PERMISSIONS} = require("../constants/permissions");
const {success, failure} = require('@utils/responses')
const {delKey} = require('@utils/redis')
const sendMail = require('@utils/mail')


/* 注册 register */
exports.register = async (req, res) => {
  try {   // 先测试邮件，如果邮件发送出错，则报错退出不会创建user record
    if (!(req.body.username && req.body.password && req.body.account)) {
      throw new BadRequest('注册字段不完整！')
    }
    const body = {
      username: req.body.username,
      account: req.body.account,
      password: req.body.password,
      nickname: req.body.nickname,
      gender: 99,
      role: 'user',
      status: 'inactive',
    }

    // 生成验证token
    const verificationToken = jwt.sign(
      {username: body.username, action: 'verify_email'},
      process.env.SECRET,
      {expiresIn: '48h'}
    );

    // 生成验证链接
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // 发送邮件通知用户
    const html = `
      您好，<span style="color: grey; font-weight: bold;">${body.nickname ? body.nickname : body.username}。</span><br><br>
      恭喜您注册成功！<br><br>
      请点击以下链接激活您的账户：<br>
      <a href="${verificationLink}">${verificationLink}</a><br><br>
      (此链接48小时内有效)<br><br>
      网站主页：<a href="https://jetlive.cn">JetArticles</a><br><br>
      <strong>————————————</strong><br><br>
      JetArticles
    `
    await sendMail(body.account, '注册成功 - 请激活您的账户', html)

    // 数据库中创建用户
    const user = await User.create(body)
    delete user.dataValues.password   // sequelize中的固定用法，删除密码字段以免前台看到密码

    // 请求成功则删除验证码，防止重用
    await delKey(req.body.captchaKey)

    success(res, '注册成功！请查看邮箱激活账户', {}, 201)

  } catch (error) {
    failure(res, error)
  }
}


/* 登陆 login */
exports.login = async (req, res) => {
  try {
    const {login, password, remember} = req.body;

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
          {username: login},
          {account: login}
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

    // 检查用户账户是否已激活
    if (user.status !== 'active') {
      throw new Unauthorized('账户未激活！请查收注册辅助邮件，点击其中的验证链接激活账户。');
    }

    // 根据是否勾选"记住我"设置token过期时间. 默认24h，选择记住我则为30天
    const expiresIn = remember ? '30d' : '24h';

    // 生成 JWT
    const token = jwt.sign(
      {id: user.id, role: user.role},
      process.env.SECRET,
      {expiresIn}
    );

    // 请求成功则删除验证码，防止重用
    await delKey(req.body.captchaKey)

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


/* 邮箱验证 */
exports.verifyEmail = async (req, res) => {
  try {
    const {token} = req.query;

    if (!token) {
      throw new BadRequest('验证链接无效！');
    }

    // 验证JWT token
    const decoded = jwt.verify(token, process.env.SECRET);

    // 检查token的用途是否正确
    if (decoded.action !== 'verify_email') {
      throw new BadRequest('验证链接无效！');
    }

    // 查找用户
    const user = await User.findOne({
      where: {
        username: decoded.username
      }
    });
    if (!user) {
      throw new NotFound('用户不存在！');
    }

    // 检查用户状态是否已激活
    if (user.status === 'active') {
      return success(res, '您的账户已经激活，无需重复操作！', {});
    }

    // 更新用户状态为激活
    await user.update({status: 'active'});

    success(res, '账户激活成功！您现在可以登录了', {});
  } catch (error) {
    // 处理JWT验证错误
    if (error.name === 'TokenExpiredError') {
      return failure(res, new BadRequest('验证链接已过期，请重新注册或联系管理'));
    }
    if (error.name === 'JsonWebTokenError') {
      return failure(res, new BadRequest('验证链接无效！'));
    }
    failure(res, error);
  }
};

/* 重新发送验证邮件 */
exports.resendVerification = async (req, res) => {
  try {
    const {email} = req.body;

    if (!email) {
      throw new BadRequest('邮箱不能为空！');
    }

    // 查找用户
    const user = await User.findOne({where: {account: email}});
    if (!user) {
      throw new NotFound('用户不存在！');
    }

    // 检查用户状态是否已激活
    if (user.status === 'active') {
      return success(res, '您的账户已经激活，无需重复操作！', {});
    }

    // 生成验证token
    const verificationToken = jwt.sign(
      {id: user.id, action: 'verify_email'},
      process.env.SECRET,
      {expiresIn: '48h'}
    );

    // 生成验证链接
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // 发送邮件
    const html = `
      您好，<span style="color: grey">${user.username}。</span><br><br>
      请点击以下链接激活您的账户：<br>
      <a href="${verificationLink}">${verificationLink}</a><br><br>
      (此链接48小时内有效)<br><br>
      网站主页：<a href="https://jetlive.cn">JetArticles</a><br><br>
      <strong>————————————</strong><br><br>
      JetArticles
    `;

    await sendMail(user.account, '账户激活 - 验证链接', html);

    success(res, '验证邮件已重新发送，请查收', {});
  } catch (error) {
    failure(res, error);
  }
};


// 发送忘记密码邮件
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new BadRequest('邮箱不能为空');
    }

    // 查找用户
    const user = await User.findOne({ where: { account: email } });
    if (!user) {
      // 出于安全考虑，即使用户不存在也返回成功，防止枚举用户
      return success(res, '如果该邮箱存在，我们已发送密码重置邮件');
    }

    // 生成重置密码的token
    const resetToken = jwt.sign(
      { id: user.id, action: 'reset_password' },
      process.env.SECRET,
      { expiresIn: '1h' }
    );

    // 生成重置密码链接
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // 发送邮件
    const html = `
      您好，<span style="color: grey">${user.username}。</span><br><br>
      我们收到了您的密码重置请求。<br><br>
      请点击以下链接重置您的密码：<br>
      <a href="${resetLink}">${resetLink}</a><br><br>
      (此链接1小时内有效，如果不是您本人操作，请忽略此邮件)<br><br>
      <strong>————————————</strong><br><br>
      JetArticles
    `;

    await sendMail(user.account, '密码重置', html);

    success(res, '已发送密码重置邮件');
  } catch (error) {
    failure(res, error);
  }
};

// 重置密码
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) throw new BadRequest('参数不完整');

    // 验证token
    const decoded = jwt.verify(token, process.env.SECRET);

    // 检查token用途
    if (decoded.action !== 'reset_password') {
      throw new BadRequest('重置链接无效');
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new NotFound('用户不存在');
    }

    await user.update({ password });

    success(res, '密码重置成功，请使用新密码登录');
  } catch (error) {
    // 处理JWT验证错误
    if (error.name === 'TokenExpiredError') {
      return failure(res, new BadRequest('重置链接已过期，请重新申请'));
    }
    if (error.name === 'JsonWebTokenError') {
      return failure(res, new BadRequest('重置链接无效'));
    }
    failure(res, error);
  }
};

// 验证重置密码的token是否有效
exports.validateResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) throw new BadRequest('参数不完整');

    // 验证token
    const decoded = jwt.verify(token, process.env.SECRET);

    // 检查token用途
    if (decoded.action !== 'reset_password') {
      throw new BadRequest('重置链接无效');
    }

    // 查找用户
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new NotFound('用户不存在');
    }

    success(res, '重置链接有效');
  } catch (error) {
    // 处理JWT验证错误
    if (error.name === 'TokenExpiredError') {
      return failure(res, new BadRequest('重置链接已过期，请重新申请'));
    }
    if (error.name === 'JsonWebTokenError') {
      return failure(res, new BadRequest('重置链接无效'));
    }
    failure(res, error);
  }
};


/* 权限获取接口 getPermissions */
exports.getPermissions = async (req, res) => {
  try {
    const {role} = req.query;
    const permissions = ROLE_PERMISSIONS[role] || [];
    success(res, '获取权限信息成功！', {permissions});
  } catch (error) {
    failure(res, error, '获取权限失败');
  }
};
