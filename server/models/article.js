'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '标题必须存在。'},
        notEmpty: { msg: '标题不能为空。'},
        len: {
          args: [2, 45],
          msg: '标题长度需要在2-45个字符之间。'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: '内容不能为空。' },
      }
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: '用户 ID 不能为空。' }
      }
    },
    channelId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: 'channel ID 不能为空。' }
      }
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: 'status 不能为空。' }
      }
    },
    readCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: 'readCount 不能为空。' }
      }
    },
    commentCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: 'commentCount 不能为空。' }
      }
    },
    likeCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      validate: {
        notNull: { msg: 'likeCount 不能为空。' }
      }
    },
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};