const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Feedback } = require('@models');
const { success, failure } = require('@utils/responses');
const { authenticate } = require('@middlewares/auth');

// 提交反馈
router.post('/', authenticate, async (req, res) => {
  try {
    const { content, nickname } = req.body;
    const feedback = await Feedback.create({
      userId: req.user.id,
      content,
      nickname: nickname || null,
      status: 'pending',
    });

    success(res, '反馈提交成功', feedback);
  } catch (error) {
    console.error('提交反馈失败:', error);
    failure(res, '提交反馈失败');
  }
});

// 获取用户反馈列表
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // 构建查询条件：显示所有已处理的反馈
    const whereCondition = {
      [Op.or]: [
        { status: 'processed' }  // 已处理的反馈
      ]
    };

    // 如果用户已登录，也显示该用户自己发布的反馈（无论状态）
    if (req.user) {
      whereCondition[Op.or].push({ userId: req.user.id });
    }

    const { count, rows } = await Feedback.findAndCountAll({
      where: whereCondition,
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    success(res, '获取反馈列表成功', {
      feedbacks: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('获取反馈列表失败:', error);
    failure(res, '获取反馈列表失败');
  }
});

module.exports = router;