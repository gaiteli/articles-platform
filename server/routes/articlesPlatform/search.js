const express = require('express');
const router = express.Router();
const { articlesIndex } = require('@utils/meilisearch');
const { success, failure } = require('@utils/responses');
const { Article, Channel } = require('@models');
const {authenticate, authorize} = require("@middlewares/auth")

// New search endpoint
router.get('/', async function (req, res, next) {
  try {
    const { q, sortBy, sortOrder, currentPage = 1, pageSize = 10, channelId, startTime, endTime } = req.query;

    // Base search parameters
    const searchParams = {
      q: q || '',
      limit: parseInt(pageSize),
      offset: (parseInt(currentPage) - 1) * parseInt(pageSize),
    };

    // Add sorting if provided
    if (sortBy) {
      searchParams.sort = [`${sortBy}:${sortOrder || 'desc'}`];
    }

    // Add filters if provided
    const filters = [];
    if (channelId) {
      filters.push(`channelId = ${channelId}`);
    }

    if (startTime && endTime) {
      filters.push(`createdAt >= ${new Date(startTime).getTime()} AND createdAt <= ${new Date(endTime + ' 23:59:59').getTime()}`);
    } else if (startTime) {
      filters.push(`createdAt >= ${new Date(startTime).getTime()}`);
    } else if (endTime) {
      filters.push(`createdAt <= ${new Date(endTime + ' 23:59:59').getTime()}`);
    }

    // Add filter for published status (unless user is admin)
    const user = req.user;
    if (!user) {
      filters.push('status = 1');
    } else if (user.role === 'user') {
      // For regular users: show public articles or their own articles
      filters.push(`(status = 1 OR userId = ${user.id})`);
    }

    if (filters.length > 0) {
      searchParams.filter = filters.join(' AND ');
    }
    console.log('!!!!!!!!!!!!!!!!!!')
    console.log(searchParams);

    // Execute search
    const searchResults = await articlesIndex.search(searchParams.q, searchParams);
    console.log(q, sortBy, sortOrder, currentPage, searchResults);

    // Format and return results
    success(res, '搜索文章成功', {
      articles: searchResults.hits,
      pagination: {
        total: searchResults.estimatedTotalHits || searchResults.nbHits,
        currentPage: parseInt(currentPage),
        pageSize: parseInt(pageSize),
      },
    });
  } catch (error) {
    console.error('文章搜索错误:', error);
    failure(res, error);
  }
});

// Sync endpoint to manually trigger reindexing of articles
router.post('/sync', authenticate, authorize(['admin:access']), async function (req, res, next) {
  try {
    // Get all articles
    const articles = await Article.findAll({
      attributes: ['id', 'title', 'content', 'readCount','likeCount', 'createdAt', 'updatedAt', 'status', 'userId', 'channelId'],
    });

    // Add channel names to each article
    const articlesWithChannel = await Promise.all(
      articles.map(async (article) => {
        const channel = await Channel.findByPk(article.channelId);
        return {
          ...article.dataValues,
          channelName: channel ? channel.name : null
        };
      })
    );

    // Bulk index all articles
    const { bulkIndexArticles } = require('@utils/meilisearch');
    await bulkIndexArticles(articlesWithChannel);

    success(res, '文章索引同步成功', { count: articles.length });
  } catch (error) {
    console.error('文章索引同步错误:', error);
    failure(res, error);
  }
});

module.exports = router;