import { LikeOutlined, LikeFilled  } from '@ant-design/icons';
import { withPermission } from '/src/components/permission/withPermission'

export const LikeButton = ({ onClick, $disabled, className, hasLiked }) => {
  console.log('进入LIkebutton组件');

  return (
    <button onClick={onClick} disabled={$disabled} className={className}>
      {hasLiked ? (
        <LikeFilled style={{ color: `var(--button-background-color)` }} />
      ) : (
        <LikeOutlined style={{ color: $disabled ? 
          `var(--border-color)` : 
          `var(--button-background-color-hover)` 
        }} />
      )}
      <span> 点赞</span>
    </button>
  );
};

export const LikeButtonWithPermission = withPermission(LikeButton);