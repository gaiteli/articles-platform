const express = require('express');
const router = express.Router();
const {Article, Channel} = require('@models');
const { Sequelize, Op } = require('sequelize');
const { NotFound } = require('http-errors')
const { success, failure } = require('@utils/responses')
const {getChannel} = require("ali-oss/lib/rtmp");

/* 创建文章 */
router.post('/write', async function (req, res, next) {
    try {

        const { title, cover, content, deltaContent, channelId } = req.body;

        // 白名单过滤（强参数过滤）：防止用户不安全的输入影响数据库
        const body = {
            userId: req.user.id,
            title: title,
            cover: cover,
            content: content,
            deltaContent: deltaContent,
            channelId: channelId ? channelId : 1,
            status: 1,
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
router.delete('/:id', async function (req, res, next) {
    try {
        // 查询当前文章
        const article = await getArticle(req);

        // 删除文章
        await article.destroy();
        success(res, 'article deleted successfully');
    } catch (error) {
        failure(res, error);
    }
});

/* 更新文章 */
router.put('/p/:id/edit', async function (req, res, next) {
    try {
        const { title, cover, content, deltaContent, channelId } = req.body;

        // 查询当前文章
        const article = await getArticle(req);

        // 更新文章内容
        const body = {
            title,
            cover,
            content,
            deltaContent,
            channelId: channelId ? channelId : 1,
        };

        await article.update(body);
        success(res, 'article updated successfully', article);
    } catch (error) {
        failure(res, error);
    }
});


/* 查询文章列表（接口复用） */
router.get('/list', async function (req, res, next) {
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
            limit: limit,
            offset: offset,
            where: {},
        };

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

        // 获取文章数据
        const { count, rows } = await Article.findAndCountAll(condition);

        success(res, 'query success', {
            articles: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            },
        });
    } catch (error) {
        failure(res, error);
    }
});

/* 查询单个文章 */
router.get('/p/:id', async function (req, res, next) {
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
router.get('/edit/:id', async function (req, res, next) {
    try {
        const article = await getArticle(req)

        const channel = await Channel.findByPk(article.channelId)

        success(res, 'query success', {...article.dataValues, channelName: channel.name});
    } catch(error) {
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