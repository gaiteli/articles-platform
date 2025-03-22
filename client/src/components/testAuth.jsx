// 1.使用
// 给出具体的需要鉴权的租金，调用高阶组件进行包装
import { withCanEdit } from './hoc/withCanEdit';

const EditButton = ({ article }) => {
  return <button>Edit Article</button>;
};
const EditButtonWithPermission = withCanEdit(EditButton);

return (
  <div>
    <h1>{article.title}</h1>
    <p>{article.content}</p>
    <EditButtonWithPermission type='editOwnResource' resource={article} />
  </div>
);


// 2。高阶组件
// 调用的hook扮演着自定义权限校验逻辑的角色
// 可以选择不同的逻辑，调用不同的自定义hook，实现权限校验的灵活性。选择可以由参数决定
import React from 'react';
import { useCanEditArticle, useCanReadArticle } from './hooks/useCanEditArticle';

export const withCanEdit = (WrappedComponent) => {
  return ({ type, resource, ...props }) => {

    switch (type) {
      case 'editOwnResource':
        const canEdit = useCanEditArticle(resource);

        if (!canEdit) {
          return null;
        }

      // case ...
    }


    return <WrappedComponent {...props} />;
  };
};


// 自定义hooks
import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // 假设 AuthContext 存储用户信息

export const useCanEditArticle = (article) => {
  const { user } = useContext(AuthContext);
  return user.id === article.authorId;
};

// 文章设置为私有则只能作者自己访问
export const useCanReadArticle = (article) => {
  const { user } = useContext(AuthContext);
  return user.id === article.authorId;
};