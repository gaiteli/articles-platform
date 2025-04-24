'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 创建Tags表
    await queryInterface.createTable('Tags', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('public', 'private'),
        allowNull: false,
        defaultValue: 'private'
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'approved'
      },
      createdBy: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true
      },
      count: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
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

    // 创建索引
    await queryInterface.addIndex('Tags', ['name', 'type', 'createdBy'], {
      unique: true,
      name: 'tag_unique_constraint'
    });

    // 创建ArticleTags关联表
    await queryInterface.createTable('ArticleTags', {
      articleId: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Articles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tagId: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // 创建索引
    await queryInterface.addIndex('ArticleTags', ['tagId'], {
      name: 'article_tag_tag_id'
    });
    await queryInterface.addIndex('ArticleTags', ['articleId'], {
      name: 'article_tag_article_id'
    });

    // 创建UserTags关联表
    await queryInterface.createTable('UserTags', {
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      tagId: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Tags',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    // 创建索引
    await queryInterface.addIndex('UserTags', ['tagId'], {
      name: 'user_tag_tag_id'
    });
    await queryInterface.addIndex('UserTags', ['userId'], {
      name: 'user_tag_user_id'
    });
  },

  async down (queryInterface, Sequelize) {
    // 删除表
    await queryInterface.dropTable('UserTags');
    await queryInterface.dropTable('ArticleTags');
    await queryInterface.dropTable('Tags');
  }
};
