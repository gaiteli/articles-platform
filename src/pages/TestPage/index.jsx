import React from 'react';
import { useState, useEffect } from "react";

export default function TestPage() {
  const list = [
    {id: 1, name: 'a'},
    {id: 2, name: 'b'},
    {id: 3, name: 'c'},
    {id: 11, name: 'az'},
    {id: 111, name: 'axy'},
    {id: 12, name: 'ab'}
  ]
  const [input, setInput] = useState('')
  const [filteredList, setFilteredList] = useState(list)

  const inputOnChange = (e) => {
    setInput(e.target.value)
  }

  useEffect(() => {       // 使用useEffect避免显示的是上一输入的结果
    setFilteredList(list.filter(
      (ele) => ele.name.toLowerCase().includes(input.toLowerCase())
    ))
  },[input])

  return (
    <div>
      <h1>Simple Search Service</h1>
      <p>This is a manually created React app without CRA or Next.js.</p>
      <input type="search" onChange={inputOnChange}/>
      <ul>
        {
          filteredList.map(item => <li key={item.id}>{ item.name }</li>)
        }
      </ul>
      <div>
        <button onClick={() => {
          fetch('http://localhost:3004/posts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: 1, // 通常ID是由服务器生成的，这里只是为了示例
              title: 'New Post',
              author: 'newAuthor',
            }),
          })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch((error) => console.error('Error:', error));
        }}>点击新增db.json-post条目</button>
        <button onClick={() => {
          fetch('http://localhost:3004/posts/1', {
            method: 'DELETE'
          })
          .then(response => {
              if (response.ok) {
                  return response.json();
              } else {
                  throw new Error('Network response was not ok.');
              }
          })
          .then(data => {
              console.log('Success:', data);
              alert('Post deleted successfully!');
          })
          .catch((error) => {
              console.error('Error:', error);
              alert('Failed to delete post.');
          });
        }}>点击删除db.json-post条目</button>
      </div>
    </div>
  );
}