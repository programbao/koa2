// 创建koa2对象
const Koa = require('Koa')
const app = new Koa()
const mongoose = require('mongoose')
const views = require('koa-views')
const {
  resolve
} = require('path')
const R = require('ramda')
const MIDDLEWARES = ['router']
const {
  connect,
  initSchemas
} = require('./database/init')
// 引入路由
const router = require('./routes/movie')
// 连接调用数据库
const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
};
(async () => {
  await connect()
  // 连接数据库后初始化所有的schema
  initSchemas()
  // require('./tasks/movie')
  // require('./tasks/api')
  await useMiddlewares(app)
  // 监听端口
  app.listen(2333, () => {
    console.log('开启端口为2333 的项目服务')
  })
})()


// 激活路由 --- koa-router 的固定用法
// app
//   .use(router.routes())
//   .use(router.allowedMethods()) // 允许最基本的方法