'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Articles', 'deltaContent', {
      allowNull: false,
      type: Sequelize.JSON
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Articles', 'deltaContent')
  }
};
