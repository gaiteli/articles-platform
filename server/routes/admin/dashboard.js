const express = require('express');
const router = express.Router();
const {Article, User} = require('@models');
const { Op } = require('sequelize')
const { success, failure } = require('@utils/responses')

router.get('/statistics', async function (req, res){
  try {

    const stats = await Promise.all([
      User.count(),
      Article.count(),
      Article.sum('likeCount')
    ]);

    success(res, 'dashboard statistics get successfully', {
      userCount: stats[0],
      articleCount: stats[1],
      totalLikes: stats[2] || 0,
    });
  } catch (error) {
    failure(res, error, '获取统计数据失败');
  }
});


router.get('/trends', async function (req, res) {
  try {
    const days = 7; // 最近7天
    const endDate = new Date();
    const startDate = new Date(endDate - days * 24 * 60 * 60 * 1000);

    const articleTrend = await Article.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    const userTrend = await User.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      articleTrend,
      userTrend
    });
  } catch (error) {
    res.status(500).json({ message: '获取趋势数据失败' });
  }
});

module.exports = router;