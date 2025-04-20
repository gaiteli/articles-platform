const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const {Channel} = require('@models');
const { Op } = require('sequelize')
const { NotFound, BadRequest } = require('http-errors');
const { success, failure } = require('@utils/responses')
const {authorize} = require("@middlewares/auth");
const {authenticate} = require("../../middlewares/auth");

/* 查询分类列表 */
router.get('/', authenticate, authorize(['article:create'], '查询分类列表'), async function(req, res, next) {
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


/* 获取分类列表（嵌套结构） */
router.get('/nested', authorize(), async (req, res) => {
  try {
    const channels = await Channel.findAll({
      order: [['rank', 'ASC']],
      attributes: ['id', 'name', 'code', 'rank']
    });

    const nestedChannels = buildNestedChannels(channels);

    success(res, '获取分类成功', nestedChannels);
  } catch (error) {
    console.error('获取分类失败:', error);
    failure(res, '获取分类失败');
  }
});


/* 查询单个分类 */
router.get('/:id', authenticate, authorize(['article:create']), async function (req, res, next) {
  try {
    const channel = await getChannel(req)

    success(res, 'query success', channel)
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


/**
 * 将平铺的分类数据转换为级联选择器需要的嵌套结构
 * @param {Array} flatChannels 原始平铺分类数据
 * @returns {Array} 嵌套结构的分类数据
 */
function buildNestedChannels(flatChannels) {
  // 1. 创建按code分组的map
  const channelMap = new Map();

  // 2. 先处理所有一级分类（code为1-9或10的倍数且<100）
  const level1Channels = flatChannels.filter(ch => {
    const code = parseInt(ch.code);
    return (code!==0) && ((code <= 9) || (code % 10 === 0 && code < 100));
  }).sort((a, b) => a.rank - b.rank);

  // 3. 构建嵌套结构
  level1Channels.forEach(l1 => {
    const l1Code = parseInt(l1.code);

    // 处理二级分类（两位数且非10的倍数）
    const level2Channels = flatChannels.filter(ch => {
      const code = parseInt(ch.code);
      return code >= 10 &&
            code < 100 &&
            code % 10 !== 0 &&
            Math.floor(code/10) === Math.floor(l1Code/10);
    }).sort((a, b) => a.rank - b.rank);

    // 处理三级分类（三位数）
    level2Channels.forEach(l2 => {
      const l2Code = parseInt(l2.code);
      l2.children = flatChannels.filter(ch => {
        const code = parseInt(ch.code);
        return code >= 100 && code < 1000 &&
                Math.floor(code/10) === Math.floor(l2Code);
      }).sort((a, b) => a.rank - b.rank)
        .map(l3 => ({
          value: l3.id,
          label: l3.name
        }));
    });

    // 构建一级分类对象
    channelMap.set(l1.id, {
      value: l1.id,
      label: l1.name,
      children: level2Channels.map(l2 => ({
        value: l2.id,
        label: l2.name,
        children: l2.children || []
      }))
    });
  });

  // 4. 处理特殊分类（code为0或1000）
  // 不返回

  // 5. 合并返回结果
  return [
    ...Array.from(channelMap.values())
  ];
}

module.exports = router;