/**
 * 借鉴Microsoft Word的字数统计方式
 * @param {string} text - 原始富文本HTML字符串
 * @param {string} mode - 统计模式
 * @returns {number|object}
 */
const getArticleLength = (text, mode = 'all') => {
  if (!text) return mode === 'all' ? {
    totalCharsWithTags: 0,    // 1. 总字符数（含html标签、空格）
    totalCharsWithoutTags: 0, // 2. 总字符数（不含html标签，计空格）
    charsNoSpaces: 0,         // 3. 总字符数（去除标签、去除空格）
    chineseAndKorean: 0,      // 4. 中文字符和朝鲜语单词
    nonChineseWords: 0,       // 5. 非中文单词
    wordCount: 0,             // 6. 字数（4+5）
    spaceCount: 0             // 7. 空格数
  } : 0;

  // 1. 总字符数（含html标签、空格） - 原始文本不做任何处理
  const totalCharsWithTags = text.length;

  // 去除HTML标签（保留换行和空格）
  const textWithoutTags = text.replace(/<[^>]+>/g, ' ');

  // 2. 总字符数（不含html标签，计空格）
  const totalCharsWithoutTags = textWithoutTags.length;
  if (mode === 'chars') return totalCharsWithoutTags;

  // 3. 总字符数（去除标签、去除空格）
  const charsNoSpaces = textWithoutTags.replace(/\s/g, '').length;

  // 7. 空格数（在去除标签的文本中统计）
  const spaceCount = (textWithoutTags.match(/\s/g) || []).length;

  // 处理中文字符和朝鲜语单词（每个汉字/朝鲜语字计为1）
  const chineseAndKorean = (textWithoutTags.match(/[\u4e00-\u9fa5\uac00-\ud7af]/g) || []).length;

  // 处理非中文单词（按空格和东亚字符分割）
  let nonChineseWords = 0;
  // 分割出所有非东亚字符的连续序列
  const nonEastAsianSequences = textWithoutTags.split(/[\u4e00-\u9fa5\uac00-\ud7af]/g);

  nonEastAsianSequences.forEach(seq => {
    // 将序列按空格分割成单词
    const words = seq.trim().split(/\s+/).filter(w => w.length > 0);
    nonChineseWords += words.length;
  });

  // 6. 字数（中文字符和朝鲜语单词 + 非中文单词）
  const wordCount = chineseAndKorean + nonChineseWords;

  switch (mode) {
    case 'total':
      return totalCharsWithTags;      // 总字符数（含html标签、空格）
    case 'chars':
      return totalCharsWithoutTags;   // 总字符数（不含html标签，计空格）
    case 'chars-no-space':
      return charsNoSpaces;          // 总字符数（去除标签、去除空格）
    case 'words-full-width':
      return chineseAndKorean;       // 中文字符和朝鲜语单词
    case 'words-half-width':
      return nonChineseWords;        // 非中文单词
    case 'words':
      return wordCount;              // 字数（4+5）
    case 'space':
      return spaceCount;             // 空格数
    default:
      return {
        'total': totalCharsWithTags,
        'chars': totalCharsWithoutTags,
        'chars-no-space': charsNoSpaces,
        'words-full-width': chineseAndKorean,
        'words-half-width': nonChineseWords,
        'words': wordCount,
        'space': spaceCount
      };
  }
}

const validateContentLength = (content, options = {}) => {
  const {
    maxTotal = Infinity,
    maxChars = Infinity,
    minChars = 1,
    checkEmpty = true
  } = options;

  // 空内容检查
  if (checkEmpty && (content.length < minChars || getArticleLength(content, '3') < minChars)) {
    throw new Error('内容不能为空');
  }

  // 总长度检查（含HTML标签）
  if (content.length > maxTotal) {
    throw new Error(`内容总长度（含标签）不能超过 ${maxTotal}`);
  }

  // 字符数检查（不含标签和空格）
  const charCount = getArticleLength(content, '3');
  if (charCount > maxChars) {
    throw new Error(`内容字符数（不含标签和空格）不能超过 ${maxChars}`);
  }

  return true;
};

module.exports = {validateContentLength};