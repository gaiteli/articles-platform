/**
 * 
 * @param {*} editor -- editor.getHTML()
 * @param {string} mode 
 * @returns
 */
const getArticleLength = (text, mode='all') => {
  if (!text) return 0;
  
  switch (mode){
    case 'char-all':      // 总字符数，包含空白字符(不含首尾空格)
      return text.trim().length
    case 'char-no-tag':     // 去除HTML标签和首尾空格的字符数
      return text.replace(/<[^>]*>/g, '').trim().length
    case 'char-no-blank':
      return text.replace(/\s/g, '').length
    case 'word':
      return text.trim().split(/\s+/).length
    case 'blank':
      return text.length - text.replace(/\s/g, '').length
    default:
      return {
        characters: text.replace(/\s/g, '').length,  // 不含空格的字符数
        words: text.trim().split(/\s+/).length,      // 词数
        spaces: text.length - text.replace(/\s/g, '').length, // 空格数
        total: text.trim().length                          // 总字符数
      };
  }
}

export {getArticleLength}