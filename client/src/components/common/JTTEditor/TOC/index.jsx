import React from 'react';
import styles from './index.module.scss';

const TOC = ({ headings }) => {
  console.log(headings);
  return (
    <nav id="toc" className={styles.toc}>
      <h1>文 章 目 录</h1>
      <hr></hr>
      <ul id="toc-list" className={styles.tocList}>
        {headings.map((heading) => {
          const { id, title, level } = heading;
          return (
            <li key={id} className={styles[`toc-${level}`]}>
              <a href={`#${id}`} className={styles.tocLink}>
                {title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TOC;