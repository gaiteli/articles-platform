'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    static associate(models) {
      // define association here
    }
  }
  Channel.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Channel name already exists' },
      validate: {
        notNull: { msg: '名称必须填写' },
        notEmpty: { msg: '名称不能为空' },
        len: { args: [1,45], msg: '长度必须在1-45字符之间'}
      }
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'code必须填写'},
        notEmpty: { msg: 'code不能为空'},
        isInt: { msg: 'code必须为整数' },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('code必须是正整数')
          }
        },
      }
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '排序必须填写'},
        notEmpty: { msg: '排序不能为空'},
        isInt: { msg: '排序必须为整数' },
        isPositive(value) {
          if (value <= 0) {
            throw new Error('排序必须是正整数')
          }
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Channel',
  });
  return Channel;
};