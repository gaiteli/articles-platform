const express = require("express")
const app = express()
const cors = require("cors")
const PORT = 9000

// 引入路径别名
require('module-alias/register');
// dotenv
require('dotenv').config()

// 中间件
const { authenticate, weakAuthenticate, adminAuthenticate, authorize } = require('./middlewares/auth');

const authRouter = require('./routes/auth')
const captchaRouter = require('./routes/captcha')

// 文章平台路由
const articlePlatformArticlesRouter = require('./routes/articlesPlatform/articles')
const uploadsRouter = require('./routes/articlesPlatform/uploads')
const articlePlatformChannelRouter = require('./routes/articlesPlatform/channels')
const usersRouter = require('./routes/articlesPlatform/users')
const articlePlatformAttachmentsRouter = require('./routes/articlesPlatform/attachments')
const articlePlatformTagsRouter = require('./routes/articlesPlatform/tags')
const searchRouter = require('./routes/articlesPlatform/search')
const articlePlatformFeedbacksRouter = require('./routes/articlesPlatform/feedbacks')

// 后台路由
const adminArticlesRouter = require('./routes/admin/articles')
const adminUsersRouter = require('./routes/admin/users')
const adminAuthRouter = require('./routes/admin/auth')
const adminAttachmentsRouter = require('./routes/admin/attachments')
const adminChannelsRouter = require('./routes/admin/channels')
const adminDashboardRouter = require('./routes/admin/dashboard')
const adminTagsRouter = require('./routes/admin/tags')
const adminFeedbackRouter = require('./routes/admin/feedbacks')

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

app.use('/', authRouter)    // /login /signup
app.use('/captcha', captchaRouter)
app.use('/articles-platform', weakAuthenticate, articlePlatformArticlesRouter)    // 在子路由中决定是否给予认证和鉴权
app.use('/articles-platform/channels', weakAuthenticate, articlePlatformChannelRouter)
app.use('/users', authenticate, usersRouter)        // /me /permissions
app.use('/uploads', authenticate, uploadsRouter)
app.use('/articles-platform/attachments', authenticate, articlePlatformAttachmentsRouter)
app.use('/articles-platform/tags', weakAuthenticate, articlePlatformTagsRouter)
app.use('/search', weakAuthenticate, searchRouter)
app.use('/articles-platform/feedbacks', authenticate, articlePlatformFeedbacksRouter)

// app.use('/admin/login', adminAuthRouter)
app.use('/admin/dashboard', authenticate, adminAuthenticate, adminDashboardRouter)
app.use('/admin/articles', authenticate, adminAuthenticate, adminArticlesRouter)
app.use('/admin/users', authenticate, adminAuthenticate, adminUsersRouter)
app.use('/admin/attachments', authenticate, adminAuthenticate, adminAttachmentsRouter)
app.use('/admin/channels', authenticate, adminAuthenticate, adminChannelsRouter)
app.use('/admin/tags', authenticate, adminAuthenticate, adminTagsRouter)
app.use('/admin/feedbacks', authenticate, adminAuthenticate, adminFeedbackRouter)


app.listen(PORT, () => {
  console.log(`server is running at port 9000`);
})