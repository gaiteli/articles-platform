'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Channels', [
      {
        channel: '推荐',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        channel: 'JAVA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        channel: 'C++',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        channel: 'JavaScript',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        channel: 'GoLang',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        channel: '数据库',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        channel: '网络安全',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        channel: '人工智能',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Channels', null, {});
  }
};
