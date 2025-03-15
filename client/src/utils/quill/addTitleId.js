import {pinyin} from 'pinyin-pro';

// 为标题生成唯一id
const generateUniqueId = (title, index) => {
  const pinyinTitle = pinyin(title, { nonZh: 'consecutive', toneType: 'none', type: 'array' }).join('-');
  const baseId = pinyinTitle.toLowerCase().replace(/\s+/g, '-');
  return `${baseId}-${index}`;
};

// 生成标题目录
const generateTOC = (headings, scrollToHeading) => {
  // return (
  //   <nav className="toc">
  //     <h2>目录</h2>
  //     <ul>
  //       {headings.map((heading) => (
  //         <li
  //           key={heading.id}
  //           className={`toc-${heading.level}`}
  //           onClick={() => scrollToHeading(heading.id)}
  //         >
  //           {heading.text}
  //         </li>
  //       ))}
  //     </ul>
  //   </nav>
  // );
};

export {generateUniqueId, generateTOC};