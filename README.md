## JetArticles - 文章创作平台

### 平台首页
首页背景图可在设置上传更换
![alt text](<屏幕截图 2025-03-28 224337.png>)
深色模式下
![alt text](<屏幕截图 2025-03-28 224434.png>)
下滑可查看最新文章和最热文章

### 文章列表
![alt text](<屏幕截图 2025-03-28 224850.png>)

### 文章创作编辑
![alt text](<屏幕截图 2025-03-28 225711.png>)

### 文章阅览
![alt text](<屏幕截图 2025-03-28 225734.png>)

### 后台管理
![alt text](<屏幕截图 2025-03-28 225900.png>) 
![alt text](<屏幕截图 2025-03-28 225811.png>) 
![alt text](<屏幕截图 2025-03-28 225836.png>)
```
info-management-system
├─ client
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ iconfont
│  │  │  ├─ iconfont.css
│  │  │  ├─ iconfont.js
│  │  │  ├─ iconfont.json
│  │  │  └─ iconfont.ttf
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ apis
│  │  │  ├─ article.jsx
│  │  │  ├─ articles_platform
│  │  │  │  ├─ article.jsx
│  │  │  │  ├─ attachment.jsx
│  │  │  │  ├─ channel.jsx
│  │  │  │  ├─ dashboard.jsx
│  │  │  │  └─ user.jsx
│  │  │  └─ user.jsx
│  │  ├─ assets
│  │  │  ├─ articles_platform
│  │  │  │  ├─ article_logo.svg
│  │  │  │  ├─ home_pic.png
│  │  │  │  ├─ no_picture_available.svg
│  │  │  │  ├─ picture_loading_failure.svg
│  │  │  │  └─ search_logo.svg
│  │  │  ├─ error.png
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ articles_platform
│  │  │  │  ├─ Footer
│  │  │  │  │  ├─ index.jsx
│  │  │  │  │  └─ index.module.scss
│  │  │  │  ├─ Header
│  │  │  │  │  ├─ index.jsx
│  │  │  │  │  └─ index.module.scss
│  │  │  │  ├─ pageComponents
│  │  │  │  │  ├─ frontPage
│  │  │  │  │  │  └─ SmallArticleList
│  │  │  │  │  │     ├─ index.jsx
│  │  │  │  │  │     └─ index.module.scss
│  │  │  │  │  └─ listPage
│  │  │  │  ├─ popouts
│  │  │  │  │  ├─ login
│  │  │  │  │  │  ├─ EmailLogin
│  │  │  │  │  │  │  ├─ index.jsx
│  │  │  │  │  │  │  └─ index.module.scss
│  │  │  │  │  │  ├─ LoginModal
│  │  │  │  │  │  │  ├─ index.jsx
│  │  │  │  │  │  │  └─ index.module.scss
│  │  │  │  │  │  └─ QuickLogin
│  │  │  │  │  │     ├─ index.jsx
│  │  │  │  │  │     └─ index.module.scss
│  │  │  │  │  └─ PopoutChannelPage
│  │  │  │  │     ├─ index.jsx
│  │  │  │  │     └─ index.module.scss
│  │  │  │  └─ widgets
│  │  │  │     ├─ CategoryCard
│  │  │  │     │  ├─ index.jsx
│  │  │  │     │  └─ index.module.scss
│  │  │  │     ├─ CoverUploader
│  │  │  │     │  ├─ index.jsx
│  │  │  │     │  └─ index.module.scss
│  │  │  │     └─ others
│  │  │  ├─ AuthRoute.jsx
│  │  │  ├─ common
│  │  │  │  ├─ JTTEditor
│  │  │  │  │  ├─ ContentArea
│  │  │  │  │  │  ├─ index.jsx
│  │  │  │  │  │  └─ index.module.scss
│  │  │  │  │  ├─ MenuBar
│  │  │  │  │  │  └─ index.jsx
│  │  │  │  │  └─ TiptapContent
│  │  │  │  │     ├─ index.jsx
│  │  │  │  │     └─ index.module.scss
│  │  │  │  ├─ QuillEditorPlus
│  │  │  │  │  ├─ EditorContent
│  │  │  │  │  │  ├─ index.jsx
│  │  │  │  │  │  └─ index.module.scss
│  │  │  │  │  ├─ EditorToolbar
│  │  │  │  │  │  ├─ index.jsx
│  │  │  │  │  │  └─ index.module.scss
│  │  │  │  │  └─ TOC
│  │  │  │  │     ├─ index.jsx
│  │  │  │  │     └─ index.module.scss
│  │  │  │  └─ Upload
│  │  │  │     ├─ core
│  │  │  │     │  └─ UploadCore.js
│  │  │  │     ├─ extensions
│  │  │  │     │  ├─ AvatarUploader.jsx
│  │  │  │     │  ├─ BgImageUploader.jsx
│  │  │  │     │  └─ CoverUploader.jsx
│  │  │  │     ├─ ImageUploader
│  │  │  │     │  ├─ ImageUploader.jsx
│  │  │  │     │  └─ index.module.scss
│  │  │  │     └─ index.js
│  │  │  └─ permission
│  │  │     ├─ buttons
│  │  │     │  ├─ DeleteButton.jsx
│  │  │     │  ├─ EditButton.jsx
│  │  │     │  ├─ index.jsx
│  │  │     │  └─ LikeButton.jsx
│  │  │     └─ withPermission.jsx
│  │  ├─ constants
│  │  │  ├─ index.js
│  │  │  └─ routers.js
│  │  ├─ index.scss
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ admin
│  │  │  │  ├─ Attachment
│  │  │  │  │  ├─ index.jsx
│  │  │  │  │  └─ index.module.scss
│  │  │  │  └─ Channel
│  │  │  │     ├─ index.jsx
│  │  │  │     └─ index.module.scss
│  │  │  ├─ Article
│  │  │  │  ├─ index.jsx
│  │  │  │  └─ index.scss
│  │  │  ├─ articles_platform
│  │  │  │  ├─ ArticleEditPage
│  │  │  │  │  ├─ index.jsx
│  │  │  │  │  └─ index.module.scss
│  │  │  │  ├─ ArticlePage
│  │  │  │  │  ├─ index.jsx
│  │  │  │  │  └─ index.module.scss
│  │  │  │  ├─ FrontPage
│  │  │  │  │  ├─ index.jsx
│  │  │  │  │  └─ index.module.scss
│  │  │  │  ├─ ListPage
│  │  │  │  │  ├─ index.jsx
│  │  │  │  │  └─ index.module.scss
│  │  │  │  └─ SettingsPage
│  │  │  │     ├─ index.jsx
│  │  │  │     └─ index.module.scss
│  │  │  ├─ errors
│  │  │  │  ├─ ErrorPage
│  │  │  │  │  ├─ index.jsx
│  │  │  │  │  └─ index.module.scss
│  │  │  │  └─ ErrorPageWithHeader
│  │  │  │     └─ index.jsx
│  │  │  ├─ Home
│  │  │  │  ├─ components
│  │  │  │  │  └─ LineChart.jsx
│  │  │  │  ├─ index.jsx
│  │  │  │  └─ index.module.scss
│  │  │  ├─ Layout
│  │  │  │  ├─ index.jsx
│  │  │  │  └─ index.scss
│  │  │  ├─ Login
│  │  │  │  ├─ Login
│  │  │  │  │  ├─ index.jsx
│  │  │  │  │  └─ index.scss
│  │  │  │  └─ Register
│  │  │  │     ├─ index.jsx
│  │  │  │     └─ index.scss
│  │  │  ├─ Publish
│  │  │  │  ├─ index.jsx
│  │  │  │  └─ index.scss
│  │  │  ├─ TestPage
│  │  │  │  └─ index.jsx
│  │  │  └─ User
│  │  │     ├─ index.jsx
│  │  │     └─ index.scss
│  │  ├─ router
│  │  │  └─ index.jsx
│  │  ├─ store
│  │  │  ├─ AuthContext.jsx
│  │  │  └─ ThemeContext.jsx
│  │  ├─ styles
│  │  ├─ test.html
│  │  ├─ utils
│  │  │  ├─ debounce.js
│  │  │  ├─ hooks
│  │  │  │  ├─ useChannels.jsx
│  │  │  │  └─ usePermission.jsx
│  │  │  ├─ index.js
│  │  │  ├─ request.js
│  │  │  ├─ tiptap
│  │  │  │  ├─ getArticleLength.js
│  │  │  │  ├─ index.js
│  │  │  │  └─ setTitleContent.js
│  │  │  └─ token.js
│  │  └─ videoTest.html
│  ├─ tailwind.config.js
│  ├─ vite.config.js
│  └─ yarn.lock
├─ README.md
├─ server
│  ├─ app.js
│  ├─ config
│  │  └─ config.json
│  ├─ constants
│  │  └─ permissions.js
│  ├─ controllers
│  │  ├─ adminArticleController.js
│  │  ├─ articleController.js
│  │  └─ authController.js
│  ├─ data
│  │  └─ mysql
│  ├─ docker-compose.yml
│  ├─ middlewares
│  │  └─ auth.js
│  ├─ migrations
│  │  ├─ 20241211080918-create-article.js
│  │  ├─ 20241214014859-create-user.js
│  │  ├─ 20250304094214-add-deltaContent-to-article.js
│  │  ├─ 20250308080104-create-attachment.js
│  │  ├─ 20250311081005-create-channel.js
│  │  ├─ 20250314020741-change-code-to-channel.js
│  │  ├─ 20250317093553-updata-role-to-user.js
│  │  ├─ 20250323035903-create-like.js
│  │  ├─ 20250325081941-add-bgImageUrl-to-user.js
│  │  └─ 20250404110820-rename-column.js
│  ├─ models
│  │  ├─ article.js
│  │  ├─ attachment.js
│  │  ├─ channel.js
│  │  ├─ index.js
│  │  ├─ like.js
│  │  └─ user.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ admin
│  │  │  ├─ articles.js
│  │  │  ├─ attachments.js
│  │  │  ├─ auth.js
│  │  │  ├─ channels.js
│  │  │  ├─ dashboard.js
│  │  │  └─ users.js
│  │  ├─ articlesPlatform
│  │  │  ├─ articles.js
│  │  │  ├─ channels.js
│  │  │  ├─ uploads.js
│  │  │  └─ users.js
│  │  └─ auth.js
│  ├─ seeders
│  │  ├─ 20241211081524-article.js
│  │  ├─ 20241214024621-user.js
│  │  ├─ 20241214085744-channel.js
│  │  └─ 20250311073001-channels.js
│  ├─ utils
│  │  ├─ aliyun.js
│  │  └─ responses.js
│  └─ www
├─ 屏幕截图 2025-03-28 224337.png
├─ 屏幕截图 2025-03-28 224434.png
├─ 屏幕截图 2025-03-28 224850.png
├─ 屏幕截图 2025-03-28 225711.png
├─ 屏幕截图 2025-03-28 225734.png
├─ 屏幕截图 2025-03-28 225811.png
├─ 屏幕截图 2025-03-28 225836.png
└─ 屏幕截图 2025-03-28 225900.png

```