import React, { createContext, useState, useEffect } from 'react';
import { getUserInfoAPI } from '/src/apis/user';
import { removeToken } from '/src/utils';
import { message } from 'antd';
import { getToken } from '/src/utils';


const initialState = {
  user: {
    id: null,
    username: null,
    role: 'guest',
    bgImageUrl: null,
  },
  permissions: [],
  isLoading: true,
}

// 给默认值给Context
const defaultAuthState = {
  ...initialState,
  setAuthState: () => {},
  removeAuth: () => {}
};
export const AuthContext = createContext(defaultAuthState);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(initialState);

  const removeAuth = () => {
    setAuthState({
      ...initialState,
      isLoading: false
    });
  }

  // 主动更新用户信息的方法
  const updateUserInfo = (newUserInfo) => {
    setAuthState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        ...newUserInfo
      }
    }));
  };
  
  // 初始化时获取用户信息
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken()
      if (!token) {
        removeAuth()
        return
      }

      try {
        const res = await getUserInfoAPI();
        const userData = res.data.user
        setAuthState({
          user: {
            id: userData.id,
            username: userData.username,
            role: userData.role,
            bgImageUrl: userData.bgImageUrl,
          },
          permissions: userData.permissions,
          isLoading: false
        });
      } catch (error) {
        message.error('AuthProvider获取用户信息失败！')
        removeAuth()
      }
    };

    initAuth();
  }, []);

  // 等待加载完成再渲染子组件
  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ ...authState, setAuthState, removeAuth, updateUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
};