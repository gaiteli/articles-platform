import React from 'react';
import { usePermission } from '/src/utils/hooks/usePermission';

export const withPermission = (WrappedComponent) => {
  // console.log('withpermission entered！')
  return ({ type, resource, onClick, ...props }) => {
    const { visible, disabled, canOperate, onDenied } = usePermission(type, resource);
    
    const handleClick = (e) => {
      if (!canOperate) {
        onDenied?.();         // 触发权限不足提示
        e.preventDefault();
        return;
      }
      onClick?.(e);         // 正常执行点击逻辑
    };

    return visible ? (
      <WrappedComponent
        {...props}
        $disabled={disabled}
        onClick={handleClick}   // 覆盖原 onClick
      />
    ) : null;
  };
};