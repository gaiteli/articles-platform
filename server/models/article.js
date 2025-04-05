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
      models.Article.belongsTo(models.User, { as: 'user' });
      models.Article.belongsToMany(models.User, { through: models.Like, foreignKey: 'articleId', as: 'likeUsers' });
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
    cover: {
      type: DataTypes.STRING(255), // 定义 cover 字段
      allowNull: true, // 允许为空
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: { msg: 'html_text内容不能为空。' },
      }
    },
    jsonContent: { // 新增：存储JSON格式
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notNull: { msg: '文章内容不能为空。' },
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