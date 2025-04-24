'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ArticleTag extends Model {
    static associate(models) {
    }
  }

  ArticleTag.init({
    articleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Articles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    tagId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Tags',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'ArticleTag',
    tableName: 'ArticleTags',
    timestamps: true,
    indexes: [
      {
        fields: ['tagId'],
        name: 'article_tag_tag_id'
      },
      {
        fields: ['articleId'],
        name: 'article_tag_article_id'
      }
    ]
  });

  return ArticleTag;
};