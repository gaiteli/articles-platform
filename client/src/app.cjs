const express = require("express")
const indexRouter = require('./routes/index.jsx')
const app = express()
const PORT = 9000

const allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 或者指定具体的域名
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204); // 无内容响应 OPTIONS 请求
  } else {
    next();
  }
};

app.use(express.json())
app.use(express.urlencoded())
// app.use(express.static(path.))


app.use(allowCrossDomain)
app.use('/', indexRouter)

app.listen(PORT, () => {
  console.log(`server is running at port 9000`);
})