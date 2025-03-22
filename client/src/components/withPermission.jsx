import React from 'react';
import { usePermission } from '/src/utils/hooks/usePermission';

export const withPermission = (WrappedComponent) => {
  return ({ type, resource, ...props }) => {
    const { visible, disabled } = usePermission(type, resource);
    
    return visible ? (
      <WrappedComponent 
        {...props} 
        $disabled={disabled} // 使用特殊prop传递状态
      />
    ) : null;
  };
};