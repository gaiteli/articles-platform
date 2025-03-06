// 为 HTML 中的标题添加 id
const addHeaderIdToHTML = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  // console.dir(doc.body.innerHTML);
  // console.dir(html);
  const headers = doc.querySelectorAll('h1, h2, h3');

  // 更新 HTML 中的标题
  headers.forEach((header, index) => {
    header.id = `header-${index}`
  });

  console.log(html.body.innerHTML);
  return {
    updatedHtml: doc.body.innerHTML
  };
};

export {addHeaderIdToHTML};