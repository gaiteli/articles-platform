'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Channels', 'code', {
      allowNull: false,
      type: Sequelize.SMALLINT.UNSIGNED,
    })

    await queryInterface.changeColumn('Channels', 'rank', {
      allowNull: false,
      type: Sequelize.SMALLINT.UNSIGNED,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Channels', 'code', {
      allowNull: false,
      type: Sequelize.INTEGER,
    })
    await queryInterface.changeColumn('Channels', 'rank', {
      allowNull: false,
      type: Sequelize.INTEGER,
    })
  }
};
