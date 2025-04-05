'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'articles','deltaContent', 'jsonContent'
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn(
      'articles',
      'jsonContent',
      'deltaContent'
    );
  }
};
