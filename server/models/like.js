'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.User, { foreignKey: 'userId' });
      Like.belongsTo(models.Article, { foreignKey: 'articleId' });
    }
  }
  Like.init({
    articleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'Articles', key: 'id' }
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
  }, {
    sequelize,
    modelName: 'Like',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'articleId'],
      },
    ],
  });
  return Like;
};