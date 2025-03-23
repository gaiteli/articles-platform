import { useNavigate } from 'react-router-dom';
import { withPermission } from '/src/components/permission/withPermission'
import { Popconfirm } from 'antd';
import { deleteArticleAPI } from '/src/apis/articles_platform/article';

export const DeleteButton = ({ id, $disabled, className }) => {
  const navigate = useNavigate();
  return (
    <Popconfirm
      description="是否删除这篇文章？"
      onConfirm={() => (async () => {
        await deleteArticleAPI(id);
        navigate('/articles/list');
      })()}
      okText="确定"
      cancelText="取消"
    >
      <button className={className} disabled={$disabled}>删除</button>
    </Popconfirm>
  );
};

export const DeleteButtonWithPermission = withPermission(DeleteButton);