// const PERMISSIONS = {
//   // 文章相关权限
//   ARTICLE: {
//     CREATE: 'article:create',
//     EDIT: 'article:edit',
//     DELETE: 'article:delete',
//     MANAGE: 'article:manage'
//   },
//
//   // 用户相关权限
//   USER: {
//     MANAGE: 'user:manage'
//   },
// };

// 角色权限映射
const ROLE_PERMISSIONS =  {
  guest: [],
  user: [],
  author: [
    'article:create',
    'article:edit',
    'article:delete',
  ],
  editor: [
    'article:create',
    'article:edit',
    'article:delete',
  ],
  admin: [
    'article:manage',
    'user:manage',
    'article:create',
    'article:edit',
    'article:delete'
  ],
  super: [
    'article:manage',
    'user:manage',
    'article:create',
    'article:edit',
    'article:delete'
  ]
}

module.exports = { ROLE_PERMISSIONS };