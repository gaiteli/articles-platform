import { pinyin } from 'pinyin-pro';

// 为标题生成唯一id
const generateUniqueId = (title, index) => {
  const pinyinTitle = pinyin(title, { nonZh: 'consecutive', toneType: 'none', type: 'array' }).join('-');
  const baseId = pinyinTitle.toLowerCase().replace(/\s+/g, '-');
  return `${baseId}-${index}`;
};

// 提取标题
const extractTitles = (contentAreaNode) => {
  const headingsNode = contentAreaNode.querySelectorAll('h1, h2, h3, h4');
  const headingsData = Array.from(headingsNode).map((heading, index) => {
    const title = heading.textContent;
    const level = heading.tagName.toLowerCase();
    const id = generateUniqueId(title, index);
    heading.setAttribute('id', id);
    return { id, title, level };
  });
  return headingsData
}

export { generateUniqueId, extractTitles };