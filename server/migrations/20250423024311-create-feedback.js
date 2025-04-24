'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Feedbacks', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      nickname: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '匿名'
      },
      type: {
        type: Sequelize.ENUM('comment', 'feedback'),
        allowNull: false,
        defaultValue: 'feedback'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      contact: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'processed'),
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
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    await queryInterface.addIndex('Feedbacks', ['userId']);
    await queryInterface.addIndex('Feedbacks', ['type']);
    await queryInterface.addIndex('Feedbacks', ['status']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Feedbacks');
  }
};
