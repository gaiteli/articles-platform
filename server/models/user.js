'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '用户名必须填写！' },
        notEmpty: { msg: '用户名不能为空！' },
        async isUnique(value) {
          const user = await User.findOne({ where: { username: value }})
          if (user) {
            throw new Error('用户名已存在，请直接登陆。')
          }
        }
      }
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '账户必须填写！' },
        notEmpty: { msg: '账户不能为空！' },
        async isUnique(value) {
          const account = await User.findOne({ where: { account: value }})
          if (account) {
            throw new Error('账户已存在，请直接登陆。')
          }
        }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      validate: { isUrl: { msg: '图片地址格式不正确。' }}
    },
    gender: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: '性别必须填写！' },
        notEmpty: { msg: '性别不能为空！' },
        isIn: { args: [[0,1,99]], msg: '性别的值须为：男-0，女-1，未选择-99'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '密码必须填写！' },
        notEmpty: { msg: '密码不能为空！' },
      },
      set(value) {
        if (value.length >= 6 && value.length <= 255) {
          this.setDataValue('password', bcrypt.hashSync(value, 8))
        } else {
          throw new Error('密码长度至少6位')
        }
      }
    },
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: '状态必须选择'},
        notEmpty: { msg: '状态不能为空！' },
        isIn: {args: [[0, 1]], msg: '状态的值必须是：正常-0，异常-1'}
      }
    },
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: '用户组必须选择'},
        notEmpty: { msg: '用户组不能为空！' },
        isIn: {args: [[0, 100]], msg: '用户组的值必须是：普通用户-0，管理员-100'}
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    isDelete: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};