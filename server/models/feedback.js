'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  Feedback.init({
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
    },
    nickname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [1, 50],
          msg: '昵称长度不超过50个字'
        }
      }
    },
    type: {
      type: DataTypes.ENUM('comment', 'feedback'),
      allowNull: false,
      defaultValue: 'feedback',
      validate: {
        isIn: {
          args: [['comment', 'feedback']],
          msg: "类型必须是 'comment' 或 'feedback'"
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '评论反馈内容不能为空'
        },
        len: {
          args: [1, 500],
          msg: '评论反馈内容长度应在1到500个字符之间'
        }
      }
    },
    contact: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: '联系方式长度不能超过50个字符'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'processed'),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'processed']],
          msg: "状态必须是 'pending' 或 'processed'"
        },
      }
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Feedback',
    tableName: 'feedbacks',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['status']
      }
    ],
    hooks: {
      beforeValidate: (feedback) => {
        // 随心评论不需要状态
        if (feedback.type === 'comment') {
          feedback.status = null;
        }
      }
    }
  });

  return Feedback;
};