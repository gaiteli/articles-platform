const express = require('express');
const router = express.Router();
const {Article} = require('@models');
const { Op } = require('sequelize')
const { NotFoundError } = require('@utils/errors')
const { success, failure } = require('@utils/responses')

/* 查询文章列表 */
router.get('/', async function(req, res, next) {
  try {
    const query = req.query
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    const condition = {
      order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    }

    // 模糊搜索
    // if (query.title) {
    //   condition.where = {
    //     title: {
    //       [Op.like]: `%${query.title}%`
    //     }
    //   }
    // }
    const totalCount = await Article.count({})
    const {count, rows} = await Article.findAndCountAll(condition)
  
    success(res, 'articles acquired successfully' , {
      articles: rows,
      pagination: {
        total: totalCount,
        currentPage,
        pageSize,
      }
    })
  } catch(error) {
    failure(res, error)
  }
});

/* 查询单个文章 */
router.get('/:id', async function (req, res, next) {
  try {
    const article = await getArticle(req)
    
    success(res, 'query success', article)
  } catch(error) {
    failure(res, error)
  }
})

/* 创建文章 */
router.post('/', async function (req, res, next) {
  try {
    console.log('进入创建文章router。post');
    console.log('user id: '+req.user.id);
    // 白名单过滤（强参数过滤）：防止用户不安全的输入影响数据库
    const body = {
      userId: req.user.id,
      title: req.body.title,
      content: req.body.content,
      channelId: req.body.channel_id,
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
    const article = await getArticle(req)

    await article.destroy()
    
    success(res, 'article deleted successfully')
  } catch(error) {
    failure(res, error)
  }
})

/* 更新文章 */
router.put('/:id', async function (req, res, next) {
  try {
    
    // 白名单过滤（强参数过滤）：防止用户不安全的输入影响数据库
    const body = {
      title: req.body.title,
      content: req.body.content,
    }

    const article = await getArticle(req)
    
    await article.update(body)

    success(res, 'article updated successfully', article)
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