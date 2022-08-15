const express = require('express')
const { MongoClient, ObjectId} = require('mongodb')

const connectUri = 'mongodb://localhost:27017'
const mongo = new MongoClient(connectUri)
const app = express()

// 配置解析请求体数据的中间件
// 他会把解析到的请求体数据放到req.body中，必须先挂载
app.use(express.json())

app.post('/articles', async (req,res,next) => {
  try {
    // 1. 获取客户端表单数据
    const { article } = req.body
    // 2. 数据验证
    if(!article || !article.title || !article.description || !article.body){
      res.status(422).json({
        error: '参数不符合规则'
      })
    }
    // 3. 把验证通过的数据插入数据库中
    await mongo.connect()
    const collection = mongo.db('test').collection('articles')
    article.createdAt = new Date()
    article.updatedAt = new Date()
    const res2 = await collection.insertOne(article)
    article._id = res2.insertedId
    res.status(201).json({
      article
    })
  } catch (err){
    next(err)
    // res.status(500).json({
    //   error: err.message
    // })
  }
  // res.send('post /articles')
})

app.get('/articles', async (req,res, next) => {
  try {
    let { page = '1', size = '10' } = req.query
    page = Number.parseInt(page)
    size = Number.parseInt(size)
    await mongo.connect()
    const collection = mongo.db('test').collection('articles')
    const xxx = await collection
      .find()
      .skip((page-1)*size)
      .limit(size)
    const articles = await xxx.toArray()
    const total = await collection.countDocuments()
    res.status(200).json({
      articles,
      total,
      page,
      size
    })
  } catch (err){
    next(err)
  }
  // res.send('get /articles')
})
app.get('/articles/:id', async (req,res) => {
  try {
    await mongo.connect()
    const collection = mongo.db('test').collection('articles')
    const articles = await collection.findOne({
      _id: ObjectId(req.params.id)
      
    })
    res.status(200).json({
      articles
    })
  } catch (err){
  
  }
  // res.send('get /article:id')
})

app.patch('/updateArticles', async (req,res, next) => {
  try {
    await mongo.connect()
    const collection = mongo.db('test').collection('articles')
    await collection.updateOne({
      _id: ObjectId(req.query.id)
    },{
      $set: req.body.article
    })
    const article = await collection.findOne({
      _id: ObjectId(req.query.id)
    })
    res.status(200).json({
      article
    })
  } catch (err){
    next(err)
  }
  // res.send('patch /article:id')
})
app.delete('/articles', (req,res, next) => {
  // res.send('delete /article:id')
})
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message
  })
})
app.listen(3000, () => {
  console.log('listening')
})
