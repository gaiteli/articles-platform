import { useNavigate } from 'react-router-dom';
import { withPermission } from '/src/components/permission/withPermission'

export const EditButton = ({ id, $disabled, className }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`./edit`)}
      disabled={$disabled}
      className={className}
    >
      编辑
    </button>
  );
};

export const EditButtonWithPermission = withPermission(EditButton);