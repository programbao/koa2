const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()


// 拿去全部的电影信息
router.get('/movies/all', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  // sort 排序 --- createAt 是从最近到最远
  const movies = await Movie.find({}).sort({
    'meta.createAt': -1
  })

  ctx.body = {
    movies
  }
})

// 拿到单个数据 --- :id 表示id变量
router.get('/movies/detail/:id', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const id = ctx.params.id
  const movies = await Movie.find({
    _id: id
  })

  ctx.body = {
    movies
  }
})

// 暴露router
module.exports = router