'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserTag extends Model {
    static associate(models) {
    }
  }

  UserTag.init({
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Users',
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
    modelName: 'UserTag',
    tableName: 'UserTags',
    timestamps: true,
    indexes: [
      {
        fields: ['tagId'],
        name: 'user_tag_tag_id'
      },
      {
        fields: ['userId'],
        name: 'user_tag_user_id'
      }
    ]
  });

  return UserTag;
};