'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
const {BadRequest} = require('http-errors');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Attachment, {as: 'attachments'})
      models.User.hasMany(models.Article, {as: 'articles'})
      models.User.belongsToMany(models.Article, { through: models.Like, foreignKey: 'userId', as: 'likeArticles' })
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
            throw new Error('用户名已存在，请直接登陆。')      // Sequelize自定义错误
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
          throw new BadRequest('密码长度至少6位')
        }
      }
    },
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    introduction: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'banned'),
      defaultValue: 'inactive',
      allowNull: false,
      validate: {
        notNull: { msg: '状态必须选择'},
        notEmpty: { msg: '状态不能为空！' },
        isIn: {
          args: [['active', 'inactive', 'banned']],
          msg: '状态的值必须是：正常-active，未激活-inactive，禁用-banned'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('guest', 'user', 'author', 'editor', 'admin', 'super'),
      defaultValue: 'guest',
      allowNull: false,
      validate: {
        notNull: { msg: '用户组必须选择' },
        notEmpty: { msg: '用户组不能为空！' },
        isIn: {
          args: [['super', 'admin', 'editor', 'author', 'user', 'guest']],
          msg: '用户组的值必须是：超级管理员-super，管理员-admin，编辑-editor，作者-author，用户-user，访客-guest'
        }
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    isDelete: DataTypes.TINYINT,
    location: DataTypes.STRING,
    articlesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    readsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    likesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastLogin: DataTypes.DATE,
    bgImageUrl: DataTypes.STRING(255),
    customFields: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};