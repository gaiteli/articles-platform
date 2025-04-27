const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Feedback, User } = require('@models');
const { success, failure } = require('@utils/responses');
const { authenticate, authorize } = require('@middlewares/auth');

/**
 * 获取所有反馈列表（管理员）
 * GET /admin/feedbacks
 */
router.get('/', async (req, res) => {
  try {
    const query = req.query;
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 构建查询条件
    const where = {};

    // 添加状态筛选
    if (query.status && query.status !== '9') {
      where.status = query.status === '0' ? 'pending' : 'processed';
    }

    // 添加内容搜索
    if (query.content) {
      where.content = { [Op.like]: `%${query.content}%` };
    }

    // 构建完整查询
    const condition = {
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'avatar'],
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: offset,
    };

    const { count, rows } = await Feedback.findAndCountAll(condition);

    success(res, '反馈列表查询成功', {
      feedbacks: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      }
    });
  } catch (error) {
    console.error('获取反馈列表失败:', error);
    failure(res, '获取反馈列表失败');
  }
});

/**
 * 更新反馈状态（审核/处理）
 * PUT /admin/feedbacks/:id
 */
router.put('/:id', async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const { status } = req.body;

    // 验证状态值
    if (!['pending', 'processed'].includes(status)) {
      return failure(res, '无效的状态值');
    }

    // 查找反馈
    const feedback = await Feedback.findByPk(feedbackId);

    if (!feedback) {
      return failure(res, '反馈不存在', 404);
    }

    // 更新状态
    await feedback.update({ status });

    success(res, '反馈状态更新成功', feedback);
  } catch (error) {
    console.error('更新反馈状态失败:', error);
    failure(res, '更新反馈状态失败');
  }
});

/**
 * 删除反馈
 * DELETE /admin/feedbacks/:id
 */
router.delete('/:id',  async (req, res) => {
  try {
    const feedbackId = req.params.id;

    // 查找反馈
    const feedback = await Feedback.findByPk(feedbackId);

    if (!feedback) {
      return failure(res, '反馈不存在', 404);
    }

    // 删除反馈
    await feedback.destroy();

    success(res, '反馈删除成功');
  } catch (error) {
    console.error('删除反馈失败:', error);
    failure(res, '删除反馈失败');
  }
});

module.exports = router;