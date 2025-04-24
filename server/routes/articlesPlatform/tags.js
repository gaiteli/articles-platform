const express = require('express');
const router = express.Router();
const { Sequelize, Op } = require('sequelize');
const { Tag, Article, ArticleTag, User, UserTag } = require('@models');
const { NotFound, BadRequest, Forbidden } = require('http-errors');
const { success, failure } = require('@utils/responses');
const { authenticate, authorize } = require('@middlewares/auth');

// 获取公共标签 标签列表（支持筛选、排序、分页）
router.get('/', authenticate, async function(req, res, next) {
  try {
    const query = req.query;
    const userId = req.user.id;

    // 分页
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 排序、筛选
    const filters = query?.filters || {};
    const sorter = query?.sorter || {};

    // 获取筛选条件
    const where = {};

    // 标签类型筛选：公共标签或用户自己的私人标签
    if (filters.type === 'public') {
      where.type = 'public';
    } else if (filters.type === 'private') {
      where.type = 'private';
      where.createdBy = userId;
    } else {
      // 默认：公共标签 + 用户自己的私人标签
      where[Op.or] = [
        { type: 'public' },
        { type: 'private', createdBy: userId }
      ];
    }

    // 标签名称模糊搜索
    if (filters.name) {
      where.name = { [Op.like]: `%${filters.name}%` };
    }

    // 状态筛选
    if (filters.status) {
      where.status = filters.status;
    } else {
      // 默认只看已通过的标签
      where.status = 'approved';
    }

    // 获取排序条件
    const order = [];
    if (Object.keys(sorter).length > 0) {
      const [field, direction] = sorter.split('_');
      order.push([field, direction.toUpperCase()]);
    } else {
      // 默认按使用次数降序
      order.push(['count', 'DESC']);
    }

    // 关联查询配置
    const include = [
      {
        model: User,
        as: 'Users',
        attributes: ['username'],
        through: { attributes: [] }, // 不返回中间表字段
      }
    ];

    const condition = {
      where,
      include,
      order,
      limit: pageSize,
      offset,
      distinct: true // 重要：避免分页计数错误
    };

    const { count, rows } = await Tag.findAndCountAll(condition);

    success(res, 'query success', {
      tags: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    });
  } catch (error) {
    console.log('获取标签列表报错：' + error);
    failure(res, error);
  }
});

// 获取用户私人标签
router.get('/user', authenticate, async function(req, res, next) {
  try {
    const userId = req.user.id;

    const tags = await Tag.findAll({
      where: {
        createdBy: userId,
        type: 'private',
        // status: 'approved'
      },
      order: [['count', 'DESC']]
    });

    success(res, 'Successfully retrieved user tags', { tags });
  } catch (error) {
    console.log('获取用户标签列表报错：', error);
    failure(res, error);
  }
});

// 创建新标签
router.post('/', authenticate, async function(req, res, next) {
  try {
    const { name, type = 'private' } = req.body;
    const userId = req.user.id;

    // 验证必要参数
    if (!name || name.trim() === '') {
      throw new BadRequest('标签名不能为空');
    }

    // 检查标签名是否已存在（区分公共和私有）
    const existingTag = await Tag.findOne({
      where: {
        name: name.toLowerCase().trim(),
        [Op.or]: [
          { type: 'public' },
          { type: 'private', createdBy: userId }
        ]
      }
    });

    if (existingTag) {
      throw new BadRequest('Tag already exists');
    }

    // 创建新标签
    const tag = await Tag.create({
      name: name.trim(),
      type,
      status: type === 'private' ? 'approved' : 'pending', // 私人标签自动审核通过，公共标签需审核
      createdBy: userId,
      count: 0
    });

    success(res, 'Tag created successfully', { tag });
  } catch (error) {
    console.log('创建标签报错：', error);
    failure(res, error);
  }
});

// 获取文章关联的标签
router.get('/article/:articleId', authenticate, async function(req, res, next) {
  try {
    const { articleId } = req.params;

    // 验证文章是否存在
    const article = await Article.findByPk(articleId);
    if (!article) {
      throw new NotFound('Article not found');
    }

    // 获取文章关联的标签
    const tags = await Tag.findAll({
      include: [{
        model: Article,
        where: { id: articleId },
        attributes: [],
        // through: { attributes: [] }
      }],
      where: {
        status: 'approved'
      }
    });

    success(res, 'Successfully retrieved article tags', { tags });
  } catch (error) {
    console.log('获取文章标签报错：', error);
    failure(res, error);
  }
});

// 为文章设置标签
router.post('/article/:articleId', authenticate, async function(req, res, next) {
  try {
    const { articleId } = req.params;
    const { tagIds } = req.body;
    const userId = req.user.id;

    // 验证文章是否存在并且属于当前用户
    const article = await Article.findOne({
      where: {
        id: articleId,
        authorId: userId
      }
    });

    if (!article) {
      throw new NotFound('文章不存在或无权修改');
    }

    // 验证所有标签ID是否有效
    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      throw new BadRequest('tagIds必须为列表且不能为空');
    }

    // 检查所有标签是否可用（公共标签或用户自己的私人标签）
    const tags = await Tag.findAll({
      where: {
        id: { [Op.in]: tagIds },
        [Op.or]: [
          { type: 'public', status: 'approved' },
          { type: 'private', createdBy: userId }
        ]
      }
    });

    if (tags.length !== tagIds.length) {
      throw new BadRequest('部分标签无效或无权使用');
    }

    // 清除原有关联
    await ArticleTag.destroy({
      where: { articleId }
    });

    // 建立新关联
    const articleTags = tagIds.map(tagId => ({
      articleId,
      tagId
    }));

    await ArticleTag.bulkCreate(articleTags);

    // 更新标签使用计数
    for (const tag of tags) {
      const count = await ArticleTag.count({
        where: { tagId: tag.id }
      });
      await tag.update({ count });
    }

    success(res, 'Article tags updated successfully');
  } catch (error) {
    console.log('设置文章标签报错：', error);
    failure(res, error);
  }
});

// 提交标签审核
router.put('/:tagId/review', authenticate, async function(req, res, next) {
  try {
    const { tagId } = req.params;
    const userId = req.user.id;

    // 验证标签是否存在且属于当前用户
    const tag = await Tag.findOne({
      where: {
        id: tagId,
        createdBy: userId,
        type: 'private'
      }
    });

    if (!tag) {
      throw new NotFound('Tag not found or you don\'t have permission');
    }

    // 只允许已审核通过的私人标签提交为公共标签
    if (tag.status !== 'approved') {
      throw new BadRequest('Only approved private tags can be submitted for review');
    }

    // 更新标签状态为待审核
    await tag.update({ status: 'pending' });

    success(res, 'Tag submitted for review successfully');
  } catch (error) {
    console.log('提交标签审核报错：', error);
    failure(res, error);
  }
});


// 获取热门标签
router.get('/hot', async function(req, res, next) {
  try {
    const limit = Math.abs(Number(req.query.limit)) || 10;

    const hotTags = await Tag.findAll({
      where: {
        type: 'public',
        status: 'approved'
      },
      order: [['count', 'DESC']],
      limit
    });

    success(res, 'query success', hotTags);
  } catch (error) {
    console.log('获取热门标签报错：' + error);
    failure(res, error);
  }
});


// 删除标签
router.delete('/:id', authenticate, async function(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      throw new NotFound('标签不存在');
    }

    // 检查删除权限：管理员可删除任何标签，普通用户只能删除自己的私人标签
    if (tag.type === 'public' && !req.user.permissions.includes('tag:manage')) {
      throw new Forbidden('无权删除公共标签');
    }

    if (tag.type === 'private' && tag.createdBy !== userId) {
      throw new Forbidden('无权删除他人的标签');
    }

    await tag.destroy();

    success(res, '删除成功');
  } catch (error) {
    console.log('删除标签报错：' + error);
    failure(res, error);
  }
});


// 根据标签获取文章列表
router.get('/:id/articles', async function(req, res, next) {
  try {
    const { id } = req.params;
    const query = req.query;

    // 分页
    const currentPage = Math.abs(Number(query.currentPage)) || 1;
    const pageSize = Math.abs(Number(query.pageSize)) || 10;
    const offset = (currentPage - 1) * pageSize;

    // 验证标签是否存在
    const tag = await Tag.findByPk(id);
    if (!tag || tag.status !== 'approved') {
      throw new NotFound('标签不存在或未通过审核');
    }

    // 如果是私人标签，需验证当前用户是否有权限访问
    if (tag.type === 'private') {
      // 这里应考虑用户是否登录的情况
      const userId = req.user?.id;
      if (!userId || tag.createdBy !== userId) {
        throw new Forbidden('无权访问此标签的文章');
      }
    }

    // 查询使用该标签的文章
    const { count, rows } = await Article.findAndCountAll({
      include: [{
        model: Tag,
        where: { id },
        attributes: [],
        through: { attributes: [] }
      }],
      where: {
        status: 1 // 假设1表示已发布状态
      },
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset
    });

    success(res, 'query success', {
      articles: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize
      }
    });
  } catch (error) {
    console.log('获取标签文章报错：' + error);
    failure(res, error);
  }
});

module.exports = router;