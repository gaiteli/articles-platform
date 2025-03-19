'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'role', {
      allowNull: false,
      defaultValue: 'guest',
      type: Sequelize.ENUM('super', 'admin', 'editor', 'author', 'user', 'guest'),
    })

    await queryInterface.changeColumn('Users', 'status', {
      allowNull: false,
      defaultValue: 'inactive',
      type: Sequelize.ENUM('active', 'inactive', 'banned'),
    })

    await queryInterface.addColumn('Users', 'location', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('Users', 'articlesCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    await queryInterface.addColumn('Users', 'readsCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    await queryInterface.addColumn('Users', 'likesCount', {
      type: Sequelize.INTEGER,
      defaultValue: 0
    });

    await queryInterface.addColumn('Users', 'lastLogin', {
      type: Sequelize.DATE
    });

    await queryInterface.addColumn('Users', 'customFields', {
      type: Sequelize.JSON
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'role', {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.TINYINT.UNSIGNED,
    })

    await queryInterface.changeColumn('Users', 'status', {
      allowNull: false,
      defaultValue: 0,
      type: Sequelize.TINYINT.UNSIGNED,
    })

    await queryInterface.removeColumn('Users', 'location')

    await queryInterface.removeColumn('Users', 'articles_count')

    await queryInterface.removeColumn('Users', 'likes_count')

    await queryInterface.removeColumn('Users', 'reads_count')

    await queryInterface.removeColumn('Users', 'last_login')

    await queryInterface.removeColumn('Users', 'custom_fields')
  }
};
