'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      account: {
        allowNull: false,
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      gender: {
        allowNull: false,
        defaultValue: 99,
        type: Sequelize.TINYINT.UNSIGNED
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      introduction: {
        type: Sequelize.TEXT
      },
      status: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT.UNSIGNED
      },
      role: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.TINYINT.UNSIGNED
      },
      isDelete: {
        type: Sequelize.TINYINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex(
      'Users', {
        fields: ['account'],
        unique: true
      })
    await queryInterface.addIndex(
      'Users', {
        fields: ['username'],
        unique: true
      })
    await queryInterface.addIndex(
      'Users', {
        fields: ['role']
      })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};