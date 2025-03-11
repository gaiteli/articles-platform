const express = require('express');
const router = express.Router();
const { Channel } = require('@models');
const { Op } = require('sequelize')
const { NotFound } = require('http-errors');
const { success, failure } = require('@utils/responses')

router.get('/', async function(req, res, next) {
  try {
    const query = req.query

    // 分页
    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize

    const condition = {
      // order: [['id', 'DESC']],
      limit: pageSize,
      offset: offset
    }

    console.log('!!!!!!!!!!page:'+currentPage+'name:'+query.name)
    // 模糊搜索
    if (query.name) {
      condition.where = {
        name: {
          [Op.like]: `%${query.name}%`
        }
      }
    }

    // const channels = await Channel.findAll(condition)
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
    failure(res, error)
  }

});


module.exports = router