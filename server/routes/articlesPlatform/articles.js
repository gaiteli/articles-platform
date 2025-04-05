const express = require('express');
const router = express.Router();
const {Article, Channel, Like, User} = require('@models');
const { Sequelize, Op } = require('sequelize');
const { NotFound, Forbidden, BadRequest } = require('http-errors')
const { success, failure } = require('@utils/responses')
const {getChannel} = require("ali-oss/lib/rtmp");
const { ROLE_PERMISSIONS } = require("@constants/permissions")
const { authenticate, authorize} = require("@middlewares/auth")

/* 创建文章 */
router.post('/write', authenticate, authorize(['article:create'], '创建文章'), async function (req, res, next) {
    try {

        const { title, cover, content, jsonContent, channelId } = req.body;

        // 白名单过滤（强参数过滤）：防止用户不安全的输入影响数据库
        const body = {
            userId: req.user.id,
            title: title,
            cover: cover,
            content: content,
            jsonContent: jsonContent,
            channelId: channelId ? channelId : 1,
            status: 0,
            readCount: 0,
            commentCount: 0,
            likeCount: 0
        }

        const article = await Article.create(body)
        console.log('文章创建成功！');

        success(res, 'article created successfully', article, 201)  // 201表示创建了新的资源
    } catch(error) {
        failure(res, error)
    }
})

/* 删除文章 */
router.delete('/:id', authenticate, authorize(), async function (req, res, next) {
    try {
        // 查询当前文章
        const article = await getArticle(req);

        // 权限判定
        const canEdit = ROLE_PERMISSIONS[req.user.role].includes('admin:access')
          || req.user.id === article.userId
        if ( !canEdit ) {
            throw new Forbidden('没有删除文章的权限！');
        }


        // 删除文章
        await article.destroy();
        success(res, 'article deleted successfully');
    } catch (error) {
        failure(res, error);
    }
});

/* 更新文章 */
router.put('/p/:id/edit', authenticate, authorize(), async function (req, res, next) {
    try {
        // 查询当前文章
        const article = await getArticle(req);
        // 权限判定
        const canEdit = ROLE_PERMISSIONS[req.user.role].includes('admin:access')
          || req.user.id === article.userId
        if (!canEdit) {
            throw new Forbidden('没有更改文章的权限！');
        }

        const { title, cover, content, jsonContent, channelId } = req.body;

        // 更新文章内容
        const body = {
            title,
            cover,
            content,
            jsonContent,
            channelId: channelId ? channelId : 1,
            status: 0,
        };

        await article.update(body);
        success(res, 'article updated successfully', article);
    } catch (error) {
        failure(res, error);
    }
});


/* 查询文章列表（接口复用） */
router.get('/list', authorize(), async function (req, res, next) {
    try {
        const query = req.query;

        // 分页参数
        const currentPage = Math.abs(Number(query.currentPage)) || 1;
        const pageSize = Math.abs(Number(query.pageSize)) || 10;
        const limit = Math.min(pageSize, Math.abs(Number(query.limit)) || pageSize); // 取 pageSize 和 limit 的最小值
        const offset = (currentPage - 1) * pageSize;

        // 排序方式
        const sortBy = query.sortBy || 'createdAt'     // 默认按发布时间排序
        const sortOrder = query.sortOrder || 'DESC'    // 默认降序

        // 构建查询条件
        const condition = {
            order: [[sortBy, sortOrder]],
            where: {},
        };

        // 1. 基础状态过滤（管理员不过滤文章审核状态，可以看到所有文章）
        if (!req.user) condition.where.status = 1
        if (req.user?.role === 'user') {
            condition.where = {
                [Op.or]: [
                    { status: 1 },          // 条件1：status=1
                    { userId: req.user.id } // 条件2：userId=当前用户
                ]
            };
        }

        // 模糊搜索标题
        if (query.title) {
            condition.where.title = {
                [Op.like]: `%${query.title}%`,
            };
        }

        // 按分类过滤
        if (query.channel) {
            condition.where.channel = query.channel;
        }

        // 按标签过滤
        if (query.tags) {
            condition.where.tags = {
                [Op.contains]: query.tags.split(','), // 假设 tags 是数组字段
            };
        }

        const totalCount = await Article.count(condition)

        // 分页
        condition.limit = limit;
        condition.offset = offset;

        // 获取文章数据
        const { count, rows } = await Article.findAndCountAll(condition);

        // 加上分类名
        const results = await Promise.all(
          rows.map(async (article) => {
              const channel = await Channel.findByPk(article.channelId);
              return {
                  ...article.dataValues,
                  channelName: channel.name
              };
          })
        );

        success(res, '获取文章列表成功', {
            articles: results,
            pagination: {
                total: totalCount,
                currentPage,
                pageSize,
            },
        });
    } catch (error) {
        console.log(error);
        failure(res, error);
    }
});

/* 查询单个文章 */
router.get('/p/:id', authorize(), async function (req, res, next) {
    try {
        const article = await getArticle(req)

        // 更新浏览次数 +1
        const body = {
            readCount: article.readCount + 1,
        }
        await article.update(body)

        const channel = await Channel.findByPk(article.channelId)

        success(res, 'query success', {...article.dataValues, channelName: channel.name});
    } catch(error) {
        failure(res, error)
    }
})

/* 编辑页面 查询单个文章 */
router.get('/edit/:id', authenticate, authorize(), async function (req, res, next) {
    try {
        const article = await getArticle(req)

        const channel = await Channel.findByPk(article.channelId)

        success(res, 'query success', {...article.dataValues, channelName: channel.name});
    } catch(error) {
        failure(res, error)
    }
})


/* 点赞 */
router.post('/p/:id/like', authenticate, authorize(), async function (req, res, next) {
    try {
        // 查询当前文章
        const article = await getArticle(req);
        const { id: articleId } = article
        const userId = req.user.id;

        // 权限判定
        const canLike = userId !== article.userId
        console.log(canLike);
        if (!canLike) {
            throw new Forbidden('不能点赞自己的文章');
        }
        console.log('权限权限！！！！！')

        // 检查是否已点赞
        const existingLike = await Like.findOne({ where: { articleId, userId } });

        if (!existingLike) {
            console.log('existing like passed!'+existingLike);
            await Like.create({ articleId, userId });
            await article.increment('likeCount');
            success(res, '点赞成功');
        } else {
            await existingLike.destroy();
            await article.decrement('likeCount');
            success(res, '取消点赞成功')
        }

    } catch (error) {
        console.log(error)
        failure(res, error);
    }
})

/* 用户是否对该篇文章点过赞 */
router.get('/p/:id/like', authenticate, authorize(), async function (req, res, next) {
    try {
        const { id } = req.params;      // 获取文章id
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            include: {
                model: Article,
                as: 'likeArticles',
            }
        })

        const likeArticles = user.likeArticles

        // 判断点赞过的文章里是否有这篇文章
        const hasLiked = likeArticles && likeArticles.some(article => article.id === id);

        success(res, '查询用户是否点赞该文章成功', {hasLiked: hasLiked});

    } catch (error) {
        console.log(error)
        failure(res, error)
    }
})


/*
 * 公共方法：查询当前文章
 */
async function getArticle(req) {
    // 获取文章ID
    const {id} = req.params

    // 查询当前文章
    const article = await Article.findByPk(id)

    // 如果没有找到，就抛出异常
    if (!article) {
        throw new NotFound(`没有找到ID为${ id }的文章`)
    }

    // 找到文章，返回
    return article
}


module.exports = router;