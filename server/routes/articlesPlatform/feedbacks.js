const express = require('express');
const router = express.Router();
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

    const { count, rows } = await Feedback.findAndCountAll({
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