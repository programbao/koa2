// 创建koa2对象
const Koa = require('Koa')
const app = new Koa()
const mongoose = require('mongoose')
const views = require('koa-views')
const {
  resolve
} = require('path')
const {
  connect,
  initSchemas
} = require('./database/init')

// 连接调用数据库
;
(async () => {
  await connect()
  // 连接数据库后初始化所有的schema
  initSchemas()

  // 使用一下数据库
  const Movie = mongoose.model('Movie')
  const movies = await Movie.find({})
  console.log(movies);

})()


app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))

app.use(async (ctx, next) => {
  await ctx.render('index', {
    you: 'one page',
    me: 'programbao'
  })
})

// 监听端口
app.listen(2333, () => {
  console.log('开启端口为2333 的项目服务')
})