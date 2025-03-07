const express = require('express');
const router = express.Router();
const {Article} = require('@models');
const { Sequelize, Op } = require('sequelize');
const { NotFoundError } = require('@utils/errors')
const { success, failure } = require('@utils/responses')

/* 创建文章 */
router.post('/write', async function (req, res, next) {
    try {
        console.log('进入文章平台-创建文章-router.post');
        console.log('user id: '+req.user.id);

        const { title, content, deltaContent, channelId } = req.body;

        // 白名单过滤（强参数过滤）：防止用户不安全的输入影响数据库
        const body = {
            userId: req.user.id,
            title: title,
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
        const { title, content, deltaContent, channelId } = req.body;

        // 查询当前文章
        const article = await getArticle(req);

        // 更新文章内容
        const body = {
            title,
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

/* 查询单个文章 */
router.get('/p/:id', async function (req, res, next) {
    try {
        const article = await getArticle(req)

        // 更新浏览次数 +1
        const body = {
            readCount: article.readCount + 1,
        }
        await article.update(body)

        success(res, 'query success', article)
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
        throw new NotFoundError(`没有找到ID为${ id }的文章`)
    }

    // 找到文章，返回
    return article
}


module.exports = router;