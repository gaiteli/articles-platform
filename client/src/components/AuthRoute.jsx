import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { AuthContext } from '/src/store/AuthContext';

/**
 * AuthRoute
 * @param {Object} props - 包含子组件、白名单角色和所需权限的对象。
 * @param {React.ReactNode} props.children - 需要权限保护的子组件。
 * @param {string[]} props.whitelistRoles - 无需权限验证即可访问的角色列表。
 * @param {string[]} props.requiredPermissions - 访问子组件所需的权限列表。
 * @returns {React.ReactNode} - 返回经过权限验证后的子组件。
 */
const AuthRoute = ({ children, whitelistRoles, requiredPermissions }) => {

  const { user, permissions, isLoading} = useContext(AuthContext);
  const location = useLocation();


  // message属于副作用
  useEffect(() => {
    if (user?.role === 'guest') {
      message.warning('没有页面权限，请登录！');
    }
  }, [user?.role]);

  // 1. 最基础需要user及以上的权限，但未登录，跳转登录页
  if (user?.role === 'guest') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 由严及宽
  // 2. 检查角色
  if (whitelistRoles) {
    const hasRole = whitelistRoles.includes(user?.role)
    if (hasRole) {
      React.cloneElement(children, { isAuthorized: true })
    }
  }

  // 检查权限
  if (requiredPermissions) {
    const hasPermission = requiredPermissions.some(p => 
      permissions.includes(p)
    );
    
    if (!hasPermission) {
      return <Navigate to="/error" replace state={{
        code: 403,
        type: '您没有访问权限',
        message: ''
      }} />;
    }
  }

  return React.cloneElement(children, { isAuthorized: false })
};

export { AuthRoute }