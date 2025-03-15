import React from 'react';
import styles from './index.module.scss'

const CategoryCard = ({ category, onRemove }) => {

  return (
    <div 
      className={`${styles.CategoryCard}`}
    >
      <span>{category?.name}</span>
      <button className={styles.removeButton} onClick={() => onRemove(category)}>
        ×
      </button>
    </div>
  );
};

export {CategoryCard}