'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Channels', [
      {
        name: '推荐',
        code: 1,
        rank: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '哲学',
        code: 10,
        rank: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '社会科学总论',
        code: 20,
        rank: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '政法',
        code: 30,
        rank: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '经济',
        code: 40,
        rank: 40,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '文艺',
        code: 50,
        rank: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '历史地理',
        code: 60,
        rank: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '自然科学总论',
        code: 70,
        rank: 70,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '工农技术总论',
        code: 80,
        rank: 80,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '计算机科学基础',
        code: 81,
        rank: 81,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '计算机技术',
        code: 82,
        rank: 82,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '计算机编程',
        code: 83,
        rank: 83,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '其它',
        code: 90,
        rank: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '算法',
        code: 811,
        rank: 811,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '前端开发',
        code: 821,
        rank: 821,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '后端开发',
        code: 822,
        rank: 822,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '客户端',
        code: 823,
        rank: 823,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '网络安全',
        code: 824,
        rank: 824,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '人工智能',
        code: 825,
        rank: 825,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '数据库',
        code: 826,
        rank: 826,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'C',
        code: 831,
        rank: 831,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'C++',
        code: 832,
        rank: 832,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'GoLang',
        code: 833,
        rank: 833,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Java',
        code: 834,
        rank: 834,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'JavaScript',
        code: 835,
        rank: 835,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Python',
        code: 837,
        rank: 837,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Rust',
        code: 838,
        rank: 838,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'TypeScript',
        code: 839,
        rank: 839,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
