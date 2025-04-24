const express = require('express');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');
const { Tag, Article, ArticleTag, User } = require('@models');
const { NotFound, BadRequest, Forbidden } = require('http-errors');
const { success, failure } = require('@utils/responses');
const { authenticate, authorize } = require('@middlewares/auth');

// 获取所有标签（管理员）
router.get('/', async function(req, res, next) {
  try {
    const query = req.query;

    // 分页
    const limit = Math.abs(Number(query.limit)) || 10;
    const page = Math.abs(Number(query.page)) || 1;
    const offset = (page - 1) * limit;

    // 筛选条件
    const where = {};

    // 标签类型筛选
    if (query.type) {
      where.type = query.type;
    }

    // 标签状态筛选
    if (query.status) {
      where.status = query.status;
    }

    // 标签名称模糊搜索
    if (query.name) {
      where.name = { [Op.like]: `%${query.name}%` };
    }

    // 创建者筛选
    if (query.createdBy) {
      where.createdBy = query.createdBy;
    }

    // 排序
    const order = [];
    if (query.orderBy) {
      const [field, direction] = query.orderBy.split('_');
      order.push([field, direction.toUpperCase() || 'ASC']);
    } else {
      // 默认按创建时间降序
      order.push(['createdAt', 'DESC']);
    }

    const { count, rows } = await Tag.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [{
        model: User,
        as: 'Users',
        attributes: ['id', 'username', 'email']
      }]
    });

    success(res, 'Successfully retrieved tags', {
      tags: rows,
      pagination: {
        total: count,
        currentPage: page,
        pageSize: limit
      }
    });
  } catch (error) {
    console.log('Admin获取标签列表报错：', error);
    failure(res, error);
  }
});

// 获取单个标签（管理员）
router.get('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id, {
      include: [{
        model: User,
        as: 'Users',
        attributes: ['id', 'username', 'email']
      }]
    });

    if (!tag) {
      throw new NotFound('Tag not found');
    }

    success(res, 'Successfully retrieved tag', { tag });
  } catch (error) {
    console.log('Admin获取单个标签报错：', error);
    failure(res, error);
  }
});

// 创建标签（管理员）
router.post('/', async function(req, res, next) {
  try {
    const { name, type = 'public', status = 'approved' } = req.body;
    const userId = req.user.id;

    // 验证必要参数
    if (!name || name.trim() === '') {
      throw new BadRequest('Tag name is required');
    }

    // 检查标签名是否已存在
    const existingTag = await Tag.findOne({
      where: {
        name: name.trim()
      }
    });

    if (existingTag) {
      throw new BadRequest('Tag already exists');
    }

    // 创建新标签
    const tag = await Tag.create({
      name: name.trim(),
      type,
      status,
      createdBy: userId,
      count: 0
    });

    success(res, 'Tag created successfully', { tag });
  } catch (error) {
    console.log('Admin创建标签报错：', error);
    failure(res, error);
  }
});

// 更新标签（管理员）
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { name, type, status } = req.body;

    // 验证标签是否存在
    const tag = await Tag.findByPk(id);
    if (!tag) {
      throw new NotFound('Tag not found');
    }

    // 如果要更新名称，检查是否与其他标签重复
    if (name && name !== tag.name) {
      const existingTag = await Tag.findOne({
        where: {
          name: name.trim(),
          id: { [Op.ne]: id }
        }
      });

      if (existingTag) {
        throw new BadRequest('Tag name already exists');
      }
    }

    // 更新标签
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (type) updateData.type = type;
    if (status) updateData.status = status;

    await tag.update(updateData);

    success(res, 'Tag updated successfully');
  } catch (error) {
    console.log('Admin更新标签报错：', error);
    failure(res, error);
  }
});

// 删除标签（管理员）
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;

    // 验证标签是否存在
    const tag = await Tag.findByPk(id);
    if (!tag) {
      throw new NotFound('Tag not found');
    }

    // 删除标签关联
    await ArticleTag.destroy({
      where: { tagId: id }
    });

    // 删除标签
    await tag.destroy();

    success(res, 'Tag deleted successfully');
  } catch (error) {
    console.log('Admin删除标签报错：', error);
    failure(res, error);
  }
});

// 审核标签（管理员）
router.put('/:id/review', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // 验证状态值
    if (!['approved', 'rejected'].includes(status)) {
      throw new BadRequest('Status must be either "approved" or "rejected"');
    }

    // 验证标签是否存在
    const tag = await Tag.findByPk(id);
    if (!tag) {
      throw new NotFound('Tag not found');
    }

    // 仅待审核的标签可以审核
    if (tag.status !== 'pending') {
      throw new BadRequest('Only pending tags can be reviewed');
    }

    // 如果拒绝必须提供原因
    // if (status === 'rejected' && (!reason || reason.trim() === '')) {
    //   throw new BadRequest('Reason is required when rejecting a tag');
    // }

    // 更新标签
    const updateData = { status };
    if (status === 'approved' && tag.type === 'private') {
      // 如果审核通过，将私人标签转为公共标签
      updateData.type = 'public';
    }

    await tag.update(updateData);

    success(res, `Tag ${status} successfully`);
  } catch (error) {
    console.log('Admin审核标签报错：', error);
    failure(res, error);
  }
});

module.exports = router;