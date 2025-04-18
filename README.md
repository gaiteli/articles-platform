## JetArticles - 文章创作平台

### 平台首页
首页：
![alt text](<屏幕截图 2025-04-18 160438.png>)
更换背景图（开启高斯模糊）：
![alt text](<屏幕截图 2025-04-18 160658.png>)
深色模式下：
![alt text](<屏幕截图 2025-04-18 160632.png>)
下滑可查看最新文章和最热门文章

### 文章列表
![alt text](<屏幕截图 2025-04-18 160922.png>)

### 文章创作编辑
进入写作页：
![alt text](<屏幕截图 2025-04-18 161008.png>)
可以更改主题：
![alt text](<屏幕截图 2025-04-18 161418.png>)
编辑现有文章：
![alt text](<屏幕截图 2025-04-18 161521.png>)
![alt text](<屏幕截图 2025-04-18 161908.png>)

### 文章阅览
![alt text](<屏幕截图 2025-04-18 163005.png>)
![alt text](<屏幕截图 2025-04-18 163331.png>)

### 后台管理
![alt text](<屏幕截图 2025-03-28 225811.png>)
![alt text](<屏幕截图 2025-03-28 225836.png>)
![alt text](<屏幕截图 2025-03-28 225900.png>)

`2025/04/18`
# 项目结构
## client/src
📦src
 ┣ 📂apis
 ┃ ┣ 📂articles_platform
 ┃ ┃ ┣ 📜article.jsx
 ┃ ┃ ┣ 📜attachment.jsx
 ┃ ┃ ┣ 📜channel.jsx
 ┃ ┃ ┣ 📜dashboard.jsx
 ┃ ┃ ┗ 📜user.jsx
 ┃ ┣ 📜article.jsx
 ┃ ┗ 📜user.jsx
 ┣ 📂assets
 ┃ ┣ 📂articles_platform
 ┃ ┃ ┣ 📜article_logo.svg
 ┃ ┃ ┣ 📜home_pic.png
 ┃ ┃ ┣ 📜no_picture_available.svg
 ┃ ┃ ┣ 📜picture_loading_failure.svg
 ┃ ┃ ┗ 📜search_logo.svg
 ┃ ┣ 📜error.png
 ┃ ┗ 📜react.svg
 ┣ 📂components
 ┃ ┣ 📂articles_platform
 ┃ ┃ ┣ 📂Footer
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┣ 📂Header
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┣ 📂pageComponents
 ┃ ┃ ┃ ┣ 📂frontPage
 ┃ ┃ ┃ ┃ ┗ 📂SmallArticleList
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┗ 📂listPage
 ┃ ┃ ┣ 📂popouts
 ┃ ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┃ ┣ 📂EmailLogin
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┃ ┣ 📂LoginModal
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┃ ┗ 📂QuickLogin
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┗ 📂PopoutChannelPage
 ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┗ 📂widgets
 ┃ ┃ ┃ ┣ 📂CategoryCard
 ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┣ 📂CoverUploader
 ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┣ 📂others
 ┃ ┃ ┃ ┗ 📂ThemeToggle
 ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┣ 📂common
 ┃ ┃ ┣ 📂JTTEditor
 ┃ ┃ ┃ ┣ 📂core
 ┃ ┃ ┃ ┃ ┣ 📜extensions.js
 ┃ ┃ ┃ ┃ ┣ 📜extensionsConfig.js
 ┃ ┃ ┃ ┃ ┗ 📜useJttEditor.js
 ┃ ┃ ┃ ┣ 📂extensions
 ┃ ┃ ┃ ┃ ┣ 📜ImageUpload.js
 ┃ ┃ ┃ ┃ ┣ 📜JttVideo.js
 ┃ ┃ ┃ ┃ ┗ 📜Link.js
 ┃ ┃ ┃ ┣ 📂TOC
 ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┗ 📂ui
 ┃ ┃ ┃ ┃ ┣ 📂ContentArea
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.jsx
 ┃ ┃ ┃ ┃ ┣ 📂LinkBubble
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┃ ┣ 📂MenuBar
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.jsx
 ┃ ┃ ┃ ┃ ┣ 📂menubars
 ┃ ┃ ┃ ┃ ┃ ┣ 📂ArticleMenubar
 ┃ ┃ ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┃ ┃ ┗ 📂CommentMenubar
 ┃ ┃ ┃ ┃ ┗ 📂VideoBubble
 ┃ ┃ ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┗ 📂Upload
 ┃ ┃ ┃ ┣ 📂core
 ┃ ┃ ┃ ┃ ┗ 📜UploadCore.js
 ┃ ┃ ┃ ┣ 📂extensions
 ┃ ┃ ┃ ┃ ┣ 📜AvatarUploader.jsx
 ┃ ┃ ┃ ┃ ┣ 📜BgImageUploader.jsx
 ┃ ┃ ┃ ┃ ┗ 📜CoverUploader.jsx
 ┃ ┃ ┃ ┣ 📂ImageUploader
 ┃ ┃ ┃ ┃ ┣ 📜ImageUploader.jsx
 ┃ ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂permission
 ┃ ┃ ┣ 📂buttons
 ┃ ┃ ┃ ┣ 📜DeleteButton.jsx
 ┃ ┃ ┃ ┣ 📜EditButton.jsx
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜LikeButton.jsx
 ┃ ┃ ┗ 📜withPermission.jsx
 ┃ ┗ 📜AuthRoute.jsx
 ┣ 📂constants
 ┃ ┣ 📜index.js
 ┃ ┣ 📜routers.js
 ┃ ┗ 📜themes.js
 ┣ 📂pages
 ┃ ┣ 📂admin
 ┃ ┃ ┣ 📂Attachment
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┗ 📂Channel
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┣ 📂Article
 ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┗ 📜index.scss
 ┃ ┣ 📂articles_platform
 ┃ ┃ ┣ 📂ArticleEditPage
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┣ 📂ArticlePage
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┣ 📂FrontPage
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┣ 📂ListPage
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┗ 📂SettingsPage
 ┃ ┃ ┃ ┣ 📜BgSettings.jsx
 ┃ ┃ ┃ ┣ 📜BgSettings.module.scss
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┣ 📜index.module.scss
 ┃ ┃ ┃ ┣ 📜ThemeSettings.jsx
 ┃ ┃ ┃ ┗ 📜ThemeSettings.module.scss
 ┃ ┣ 📂errors
 ┃ ┃ ┣ 📂ErrorPage
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.module.scss
 ┃ ┃ ┗ 📂ErrorPageWithHeader
 ┃ ┃ ┃ ┗ 📜index.jsx
 ┃ ┣ 📂Home
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┗ 📜LineChart.jsx
 ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┗ 📜index.module.scss
 ┃ ┣ 📂Layout
 ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┗ 📜index.scss
 ┃ ┣ 📂Login
 ┃ ┃ ┣ 📂Login
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.scss
 ┃ ┃ ┗ 📂Register
 ┃ ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┃ ┗ 📜index.scss
 ┃ ┣ 📂TestPage
 ┃ ┃ ┗ 📜index.jsx
 ┃ ┗ 📂User
 ┃ ┃ ┣ 📜index.jsx
 ┃ ┃ ┗ 📜index.scss
 ┣ 📂router
 ┃ ┗ 📜index.jsx
 ┣ 📂store
 ┃ ┣ 📜AuthContext.jsx
 ┃ ┗ 📜ThemeContext.jsx
 ┣ 📂styles
 ┃ ┣ 📂themes
 ┃ ┃ ┣ 📜crimsonRed.js
 ┃ ┃ ┣ 📜dark.js
 ┃ ┃ ┣ 📜emeraldGreen.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┣ 📜index.scss
 ┃ ┃ ┣ 📜lakeBlue.js
 ┃ ┃ ┣ 📜lavender.js
 ┃ ┃ ┣ 📜light.js
 ┃ ┃ ┣ 📜warmOrange.js
 ┃ ┃ ┣ 📜_base.scss
 ┃ ┃ ┗ 📜_baseColors.scss
 ┃ ┗ 📜global.scss
 ┣ 📂utils
 ┃ ┣ 📂hooks
 ┃ ┃ ┣ 📜useChannels.jsx
 ┃ ┃ ┗ 📜usePermission.jsx
 ┃ ┣ 📂tiptap
 ┃ ┃ ┣ 📜getArticleLength.js
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┗ 📜setTitleContent.js
 ┃ ┣ 📜debounce.js
 ┃ ┣ 📜index.js
 ┃ ┣ 📜request.js
 ┃ ┗ 📜token.js
 ┣ 📜index.scss
 ┣ 📜main.jsx

 ## server（主要部分）
 📦controllers
 ┣ 📜adminArticleController.js
 ┣ 📜articleController.js
 ┗ 📜authController.js
 📦middlewares
 ┗ 📜auth.js
 📦models
 ┣ 📜article.js
 ┣ 📜attachment.js
 ┣ 📜channel.js
 ┣ 📜draft.js
 ┣ 📜index.js
 ┣ 📜like.js
 ┗ 📜user.js
 📦routes
 ┣ 📂admin
 ┃ ┣ 📜articles.js
 ┃ ┣ 📜attachments.js
 ┃ ┣ 📜auth.js
 ┃ ┣ 📜channels.js
 ┃ ┣ 📜dashboard.js
 ┃ ┗ 📜users.js
 ┣ 📂articlesPlatform
 ┃ ┣ 📜articles.js
 ┃ ┣ 📜attachments.js
 ┃ ┣ 📜channels.js
 ┃ ┣ 📜uploads.js
 ┃ ┗ 📜users.js
 ┗ 📜auth.js
 📦utils
 ┣ 📜aliyun.js
 ┗ 📜responses.js
 📜app.js