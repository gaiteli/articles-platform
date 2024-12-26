const express = require('express');
const router = express.Router();
const {User} = require('@models');
const { Op } = require('sequelize')
const { NotFoundError } = require('@utils/errors')
const { success, failure } = require('@utils/responses')

/* 查询用户列表 */
router.get('/', async function(req, res, next) {
  try {
    const query = req.query
    console.log(query)

    const currentPage = Math.abs(Number(query.currentPage)) || 1
    const pageSize = Math.abs(Number(query.pageSize)) || 10
    const offset = (currentPage - 1) * pageSize
    const username = query.username
    const status = query.status;

    const condition = {
      order: [['id', 'DESC']],
      where: {}
    }

    // 筛选
    if (status) {
      if (status !== '9') {
        condition.where.status = status; // Filter by status
      }
    }

    // 模糊搜索
    if (username) {
      condition.where = {
        username: {
          [Op.like]: `%${username}%`
        }
      }
    }
    // if (query.account) {
    //   condition.where = {
    //     account: {
    //       [Op.eq]: `%${query.account}%`
    //     }
    //   }
    // }
    // if (query.role) {
    //   condition.where = {
    //     role: {
    //       [Op.eq]: `%${query.role}%`
    //     }
    //   }
    // }
    const totalCount = await User.count(condition)

    // 分页
    condition.limit = pageSize;
    condition.offset = offset;
    const {count, rows} = await User.findAndCountAll(condition)
  
    success(res, 'query success' , {
      users: rows,
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

/* 查询单个用户 */
router.get('/:id', async function (req, res, next) {
  try {
    const user = await getUser(req)
    
    success(res, 'query success', user)
  } catch(error) {
    failure(res, error)
  }
})

/* 创建用户 */
// router.post('/', async function (req, res, next) {
//   try {

//     // 白名单过滤（强参数过滤）：防止用户不安全的输入影响数据库
//     const body = filterBody(req)

//     const user = await User.create(body)
//     delete user.dataValues.password   // sequelize中的固定用法，删除密码字段以免前台看到密码

//     success(res, 'user created successfully', user, 201)  // 201表示创建了新的资源
//   } catch(error) {
//     failure(res, error)
//   }
// })

/* 删除用户: 一般做成禁用账号 */


/* 更新用户 */
router.put('/:id', async function (req, res, next) {
  try {
    
    const user = await getUser(req)

    // 白名单过滤（强参数过滤）：防止用户不安全的输入影响数据库
    const body = filterBody(req, user)
    
    await user.update(body)
    delete user.dataValues.password   // sequelize中的固定用法，删除密码字段以免前台看到密码

    success(res, 'user updated successfully', user)
  } catch(error) {
    failure(res, error)
  }
})

/*
 * 公共方法：查询当前用户
 */
async function getUser(req) {
  // 获取用户ID
  const {id} = req.params

  // 查询当前用户
  const user = await User.findByPk(id)

  // 如果没有找到，就抛出异常
  if (!user) {
    throw new NotFoundError(`没有找到ID为${ id }的用户`)
  }

  // 找到用户，返回
  return user
}

/*
 * 公共方法：白名单过滤
 */
function filterBody(req, user) {
  return {
    account: req.body.account || user.account,
    username: req.body.username || user.username,
    avatar: req.body.avatar || user.avatar,
    gender: req.body.gender || user.gender,
    password: req.body.password || user.password,
    phone: req.body.phone || user.phone,
    email: req.body.email || user.email,
    introduction: req.body.introduction || user.introduction,
    status: req.body.status ?? user.status,
    role: req.body.role || user.role,

  }
}

module.exports = router;