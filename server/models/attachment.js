'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Attachment.belongsTo(models.User, {as: 'user'})
    }
  }
  Attachment.init({
    userId: DataTypes.INTEGER.UNSIGNED,
    originalname: DataTypes.STRING,
    filename: DataTypes.STRING,
    mimetype: DataTypes.STRING,
    size: DataTypes.STRING,
    path: DataTypes.STRING,
    fullpath: DataTypes.STRING,
    url: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM('pic', 'cover', 'bg', 'avatar'),
      allowNull: false,
      defaultValue: 'pic'
    }
  }, {
    sequelize,
    modelName: 'Attachment',
  });
  return Attachment;
};