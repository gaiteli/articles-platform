'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const articles = [];
    const counts = 99;

    for (let i = 1; i <= counts; i++) {
      const article = {
        userId: i < 10 ? 1 : (100 + counts % 10),
        title: `文章的标题 ${i}`,
        content: `文章的内容 ${i}`,
        channelId: 1,
        status: 1,
        readCount: 0,
        commentCount: 0,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      articles.push(article);
    }

    await queryInterface.bulkInsert('Articles', articles, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Articles', null, {});
  }
};
