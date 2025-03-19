const jwt = require('jsonwebtoken');
const { createError, Unauthorized, NotFound, Forbidden } = require('http-errors');

const { User } = require('@models');
const { ROLE_PERMISSIONS } = require('../constants/permissions');
const {failure} = require("../utils/responses");

// 通用认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Unauthorized('token不存在！');

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new NotFound('用户不存在！')
    }

    // if (user.status !== 'inactive') {
    //   throw new Forbidden('用户未激活');
    // }

    req.user = {
      id: user.id,
      role: user.role,
      permissions: ROLE_PERMISSIONS[user.role] || []
    };

    next();
  } catch (error) {
    failure(res, error, '认证失败');
  }
};

// 管理员认证中间件
const adminAuthenticate = async (req, res, next) => {
  try {
    if ( !['admin', 'super'].includes(req.user.role) ) {
      throw new Forbidden('没有管理员权限！')
    }

    next()
  } catch (error) {
    failure(res, error, '管理员认证失败');
  }
}

// 权限检查中间件
const authorize = (requiredPermission) => {
  return (req, res, next) => {
    // 从用户角色中获取权限
    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];

    // 检查是否拥有所需权限
    const hasPermission = userPermissions.includes(requiredPermission);

    if (!hasPermission) {
      throw new Forbidden('没有相应权限！')
    }

    next();
  };
};

// 所有权检查中间件
// const checkOwnership = (modelName, idParam = 'id') => {
//   return async (req, res, next) => {
//     try {
//       const record = await sequelize.models[modelName].findByPk(req.params[idParam]);
//
//       if (!record) return res.status(404).json({ message: '资源不存在' });
//       if (record.userId !== req.user.id) return res.status(403).json({ message: '无权操作此资源' });
//
//       req.resource = record;
//       next();
//     } catch (error) {
//       res.status(500).json({ message: '所有权验证失败' });
//     }
//   };
// };


module.exports = {authenticate, adminAuthenticate, authorize};