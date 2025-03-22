import { useContext } from 'react';
import { AuthContext } from '/src/store/authContext';

export const usePermission = (type, resource) => {
  const { user } = useContext(AuthContext);

  // 定义权限策略
  const policy = {
    // 编辑自有资源
    editOwnResource: () => 
      ['admin','super'].includes(user.role) || user.id === resource.authorId,

    // 删除自有资源
    deleteOwnResource: () => 
      ['admin','super'].includes(user.role) || user.id === resource.authorId,

    // 点赞权限（非作者可见但禁用）
    likeArticle: () => ({
      visible: true, // 所有人可见
      disabled: user.id === resource.authorId // 作者禁用
    }),

    // 审核状态可见性
    viewUnapproved: () => 
      ['admin','super'].includes(user.role) || user.id === resource.authorId
  };

  // 返回权限结果
  const check = () => {
    const result = policy[type]?.();
    return typeof result === 'boolean' 
      ? { visible: result, disabled: false } // 兼容旧模式
      : result;
  };

  return check() || { visible: false, disabled: false };
};