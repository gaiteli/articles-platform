const { v4 } = require('uuid')

const moment = require('moment') 
const express = require('express')
const { message } = require('antd')
const router = express.Router()

// 删除文章后端接口
router.delete('/articles/:id', async (req, res) => {
  const articleId = req.params.id
  const response = await fetch(`http://localhost:3004/articles/${articleId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await response.json()
  
  res.json({
    data: null,
    message: 'ok'
  })
})

// 获取文章列表后端接口
router.get('/articles', async (req, res) => {
  const response = await fetch(`http://localhost:3004/articles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await response.json()
  console.log(typeof data);
  res.json({
    articles: data,
    total_count: data.length
  })
})

// 发布文章后端接口
router.post('/articles', async (req, res) => {
  const id = v4()
  const token = req.headers['authorization'].split(' ')[1]
  const userInfo = await getUserInfo(token)
  const user_id = userInfo[0].user_id

  const response = await fetch(`http://localhost:3004/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      user_id: user_id,
      title: req.body.title,
      content: req.body.content,
      cover: req.body.cover,
      channel_id: req.body.channel_id,
      status: 1,
      pubdate: moment().format('YYYY-MM-DD HH:mm:ss'),
      read_count: 0,
      comment_count: 0,
      like_count: 0
    }),
  })
  const data = await response.json()
  
  res.json({
    id: id,
    message: 'ok'
  })
})

// 频道列表后端接口
router.get('/channels', async (req, res) => {
  const response = await fetch(`http://localhost:3004/channels`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await response.json()
  res.json({
    channels: data})
})

// 用户信息后端接口  => /user/me
router.get('/user', async (req, res) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1]; // Bearer token 格式 => "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Token missing from Authorization header' });
  }

  // 获取
  const data = await getUserInfo(token)

  if (!data[0]) {
    console.log('data is undefined')
    return res.status(401).json({ message: 'token not found or expired' });
  }

  res.json({
    user_id: data[0].id,
    user_name: data[0].mobile,
  })
})

// 登录后端接口
router.post('/login', (req, res) => {
  const id = v4()
  const token = req.body.token || v4()
  
  fetch('http://localhost:3004/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      mobile: req.body.mobile,
      code: req.body.code,
      token: token
    }),
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => console.error('Error:', error));

  res.json({ 
    id: id,
    token: token,
  })
})

// 测试接口
router.get('/test', function(req, res, next){
  res.send('test page loaded successful')
})


// 工具函数

// 检验token
function checkToken(req) {
}

// 用户查询（查询用户id等）
// 返回用户信息
async function getUserInfo(token) {
  const response = await fetch(`http://localhost:3004/posts?token=${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  return await response.json()
}

module.exports = router