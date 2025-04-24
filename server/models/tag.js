'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // 与Article模型多对多关联
      Tag.belongsToMany(models.Article, {
        through: 'ArticleTag',
        foreignKey: 'tagId',
        otherKey: 'articleId'
      });

      // 与User模型多对多关联（通过UserTag）
      Tag.belongsToMany(models.User, {
        through: 'UserTag',
        as: 'Users',
        foreignKey: 'tagId',
        otherKey: 'userId'
      });
    }
  }

  Tag.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: { msg: '标签名必须填写' },
        notEmpty: { msg: '标签名不能为空' },
        len: { args: [1, 50], msg: '长度必须在1-50字符之间' }
      }
    },
    type: {
      type: DataTypes.ENUM('public', 'private'),
      allowNull: false,
      defaultValue: 'private',
      comment: '标签类型：public-公共标签，private-私人标签'
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'approved',
      comment: '标签状态：pending-审核中，approved-已通过，rejected-已拒绝'
    },
    createdBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: '创建人ID，若为公共标签由管理员创建则为管理员ID'
    },
    count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: '标签使用次数'
    }
  }, {
    sequelize,
    modelName: 'Tag',
    indexes: [
      {
        unique: true,
        fields: ['name', 'type', 'createdBy'],
        name: 'tag_unique_constraint'
      }
    ],
    hooks: {
      // 在创建前确保标签名转换为小写
      beforeCreate: (tag) => {
        tag.name = tag.name.toLowerCase().trim();
      },
      beforeUpdate: (tag) => {
        if (tag.name) {
          tag.name = tag.name.toLowerCase().trim();
        }
      }
    }
  });

  return Tag;
};