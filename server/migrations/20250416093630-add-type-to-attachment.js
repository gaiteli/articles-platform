'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Attachments', 'type', {
      type: Sequelize.ENUM('pic', 'cover', 'bg', 'avatar'),
      allowNull: false,
      defaultValue: 'pic'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Attachments', 'type');
  }
};
