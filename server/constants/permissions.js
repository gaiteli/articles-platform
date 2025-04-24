const guest = [
  'article:read',
]
const user = [
  'article:create',
  'article:edit',
  'article:delete',
  ...guest,
]
const admin = [
  'admin:access',
  'article:manage',
  'user:manage',
  'tag:manage',
  ...user,
]
const superAdmin = [
  ...admin,
]

// 角色权限映射
const ROLE_PERMISSIONS =  {
  guest: guest,
  user: user,
  // author:
  // editor:
  admin: admin,
  super: superAdmin,
}

module.exports = { ROLE_PERMISSIONS };