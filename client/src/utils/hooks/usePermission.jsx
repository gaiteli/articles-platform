import { useContext } from 'react';
import { AuthContext } from '/src/store/AuthContext';
import { message } from 'antd'

export const usePermission = (type, resource) => {
  const { user } = useContext(AuthContext);
  console.log('usePemission entered！');

  // 定义权限策略
  const policy = {
    // 编辑自有资源 他人不可见
    editOwnResource: () => ({
      visible: ['admin','super'].includes(user.role) || user.id === resource.userId,
      disabled: false,
      canOperate: false,
      onDenied: () => {}
    }),

    // 删除自有资源 他人不可见
    deleteOwnResource: () => ({
      visible: ['admin','super'].includes(user.role) || user.id === resource.userId,
      disabled: false,
      canOperate: false,
      onDenied: () => {}
    }),

    // 点赞按钮 游客不可见 作者禁用
    likeArticle: () => ({
      visible: true,
      disabled: user.id === resource.userId,
      canOperate: user.role !== 'guest' && user.id !== resource.userId,
      onDenied: () => {
        if (user && user.role !== 'guest') message.warning('您不能点赞自己的文章！')
        else message.warning('请先登陆！')
      }
    }),

    // 审核状态可见性
    viewUnapproved: () => ({
      visible: ['admin','super'].includes(user.role) || user.id === resource.userId,
      disabled: false,
      canOperate: false,
      onDenied: () => {}
    })
  };

  return policy[type]?.() || { visible: false, disabled: false, canOperate: false };
};