import express from "express";

// routes
import auth from "./Routes/auth-native.js";

const app = express()

// 配置解析请求体数据的中间件
// 他会把解析到的请求体数据放到req.body中，必须先挂载
// 他和body-parser作用是一样的，express4.16的版本说明提到了这一点
app.use(express.json())
app.listen(5201,() => {
  console.log('listening on port 5201')
})

app.use('/auth', auth)
