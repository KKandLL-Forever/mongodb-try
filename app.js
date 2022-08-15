import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";


// routes
import auth from "./Routes/auth.js";
import users from "./Routes/users.js";
import post from "./Routes/post.js";


const app = express()

// 配置解析请求体数据的中间件
// 他会把解析到的请求体数据放到req.body中，必须先挂载
// 他和body-parser作用是一样的，express4.16的版本说明提到了这一点
app.use(express.json({limit: "30mb"}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
dotenv.config()

mongoose.connect(
  process.env.MONGODB,
  {
  useNewUrlParser: true,
  useUnifiedTopology: true
  },
  null)
  .then(() => app.listen(process.env.PORT, () => console.log(`Listening at Port ${process.env.PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

app.use('/auth', auth)
app.use('/users', users)
app.use('/post', post)
