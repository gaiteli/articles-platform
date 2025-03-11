/**
 * 防抖函数 debounce.js
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 防抖间隔时间（毫秒）
 * @returns {Function} - 返回防抖后的函数
 */
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args); // 延迟执行函数
    }, delay);
  };
}

export {debounce};