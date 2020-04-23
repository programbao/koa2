// 创建koa2对象
const Koa = require('Koa')
const app = new Koa()

// 创建中间件
app.use(async (ctx, next) => {
  ctx.body = '创建第一个koa2 项目'
  await next()
})

// 监听端口
app.listen(2333, () => {
  console.log('开启端口为2333 的项目服务')
})