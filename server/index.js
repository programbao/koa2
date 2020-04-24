// 创建koa2对象
const Koa = require('Koa')
const app = new Koa()
const ejs = require('ejs')
const pug = require('pug')
const {
  htmlTpl,
  ejsTpl,
  pugTpl
} = require('./tpl')
// 创建中间件
app.use(async (ctx, next) => {
  // 设置请求头为HTML
  ctx.type = 'text/html;charset="utf-8"'
  ctx.body = pug.render(pugTpl, {
    you: 'one page',
    me: 'programbao'
  })
})

// 监听端口
app.listen(2333, () => {
  console.log('开启端口为2333 的项目服务')
})