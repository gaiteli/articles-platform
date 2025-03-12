const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 9000

// 引入路径别名
require('module-alias/register');
// dotenv
require('dotenv').config()

// 中间件
const login = require('@middlewares/login')
const adminLogin = require('@middlewares/adminLogin')

// 后台路由
const indexRouter = require('./routes/index')
const adminArticlesRouter = require('./routes/admin/articles')
const adminUsersRouter = require('./routes/admin/users')
const adminSigninRouter = require('./routes/admin/auth')
const adminAttachmentsRouter = require('./routes/admin/attachments')
const adminChannelsRouter = require('./routes/admin/channels')

// 前台路由
const authRouter = require('./routes/auth')
const channelsRouter = require('./routes/channels')
const articlesRouter = require('./routes/articles')
const usersRouter = require('./routes/users')

// 文章平台路由
const articlePlatformArticlesRouter = require('./routes/articlesPlatform/articles')
const uploadsRouter = require('./routes/articlesPlatform/uploads')

// cors跨域
const corsOptions = {
  origin: [
    'https://xxx.cn',
    'http://localhost:5173'
  ]
}
app.use(cors(corsOptions));


app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use('/', indexRouter)

app.use('/admin/signin', adminSigninRouter) // 注意登陆不能加login中间件
app.use('/admin/articles', login, adminLogin, adminArticlesRouter) // 访问该路径对应的路由文件就是admin..
app.use('/admin/users', login, adminLogin, adminUsersRouter)
app.use('/admin/attachments', login, adminLogin, adminAttachmentsRouter)
app.use('/admin/channels', login, adminLogin, adminChannelsRouter)

app.use('/', authRouter)    // login / signup
app.use('/users', login, usersRouter)
app.use('/channels', login, channelsRouter)
app.use('/articles', login, articlesRouter)

app.use('/articles-platform', login, articlePlatformArticlesRouter)
app.use('/uploads', login, uploadsRouter)

app.listen(PORT, () => {
  console.log(`server is running at port 9000`);
})