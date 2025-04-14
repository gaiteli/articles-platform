module.exports = (sequelize, DataTypes) => {
  const Draft = sequelize.define('Draft', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Articles',
        key: 'id'
      },
      comment: '关联的文章ID，如果是新建文章则为null'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '无标题'
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    jsonContent: {
      type: DataTypes.JSON,
      allowNull: true
    },
    channelId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Channels',
        key: 'id'
      }
    }
  }, {
    tableName: 'drafts',
    timestamps: true,
    paranoid: true, // 使用软删除
    comment: '文章草稿表'
  });

  Draft.associate = (models) => {
    // 草稿和用户的关联
    Draft.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author'
    });

    // 草稿和文章的关联（一对一）
    Draft.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article'
    });

    // 草稿和分类的关联
    Draft.belongsTo(models.Channel, {
      foreignKey: 'channelId',
      as: 'channel'
    });
  };

  return Draft;
};