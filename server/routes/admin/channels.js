const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const {Channel} = require('@models');
const { Op } = require('sequelize')
const { NotFound, BadRequest } = require('http-errors');
const { success, failure } = require('@utils/responses')

/* 查询分类列表 */
router.get('/', async function(req, res, next) {
  try {
    const query = req.query

    // 分页
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize
    // 排序、筛选
    const filters = query?.filters || {}
    const sorter = query?.sorter || {}


    // 获取筛选条件
    const where = {};
    if (filters.name) where.name = { [Op.like]: `%${filters.name}%` };  // 模糊搜索
    if (filters.code) where.code = filters.code;
    if (filters.rank) where.rank = filters.rank;

    // 获取排序条件
    const order = [];
    if (Object.keys(sorter).length > 0) {
      // sorter不为空对象
      const [field, direction] = sorter.split('_');
      order.push([field, direction.toUpperCase()]);
    } else {
      // sorter为空，按默认排序按id进行
      order.push(['id', 'DESC'])
    }


    const condition = {
      where,
      order,
      limit: pageSize,
      offset: offset
    }

    const {count, rows} = await Channel.findAndCountAll(condition)
  
    success(res, 'query success' , {
      channels: rows,
      pagination: {
        total: count,
        currentPage,
        pageSize,
      }
    })
  } catch(error) {
    console.log('获取分类报错：'+error)
    failure(res, error)
  }
  
});

/* 查询单个分类 */
router.get('/:id', async function (req, res, next) {
  try {
    const channel = await getChannel(req)
    
    success(res, 'query success', channel)
  } catch(error) {
    failure(res, error)
  }
})

/* 创建分类 */
router.post('/', async function (req, res, next) {
  try {

    // 白名单过滤（强参数过滤）：防止用户不安全的输入影响数据库
    const body = {
      name: '请填写分类名',
      code: 0,
      rank: 0,
    }

    const channel = await Channel.create(body)

    success(res, 'channel created successfully', channel, 201)  // 201表示创建了新的资源
  } catch(error) {
    failure(res, error)
  }
})

/* 删除分类 */
router.delete('/:id', async function (req, res, next) {
  try {
    const channel = await getChannel(req)

    await channel.destroy()
    
    success(res, 'channel deleted successfully')
  } catch(error) {
    failure(res, error)
  }
})

/* 更新分类 */
router.put('/:id', async function (req, res, next) {
  try {

    const {id} = req.params
    const {name, code, rank} = req.body

    const existingName = await Channel.findOne({ where: { name } });

    if (existingName)
      if (existingName.id !== Number(id)) throw new BadRequest('分类名已存在，请修改')
    const existingCode = await Channel.findOne({ where: { code } });
    if (existingCode)
      if (existingCode.id !== Number(id)) throw new BadRequest('分类编号已存在，请修改')
    
    // 白名单过滤（强参数过滤）：防止用户不安全的输入影响数据库
    const body = {
      name: name,
      code: code,
      rank: rank,
    }

    const channel = await getChannel(req)
    
    await channel.update(body)

    success(res, 'channel updated successfully', channel)
  } catch(error) {
    failure(res, error)
  }
})

/*
 * 公共方法：查询当前分类
 */
async function getChannel(req) {
  // 获取分类ID
  const {id} = req.params

  // 查询当前分类
  const channel = await Channel.findByPk(id)

  // 如果没有找到，就抛出异常
  if (!channel) {
    throw new NotFound(`没有找到ID为${ id }的分类`)
  }

  // 找到分类，返回
  return channel
}

module.exports = router;