const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()

// 控制器装饰器
@controller('/api/v0/movies')
export class movieController {
  @get('/')
  async getMovies(ctx, next) {
    const Movie = mongoose.model('Movie')
    // sort 排序 --- createAt 是从最近到最远
    const movies = await Movie.find({}).sort({
      'meta.createAt': -1
    })

    ctx.body = {
      movies
    }
  }
  // 拿到单个数据 --- :id 表示id变量
  @get('/:id')
  async getMoviesDetail(ctx, next) {
    const Movie = mongoose.model('Movie')
    const id = ctx.params.id
    const movies = await Movie.find({
      _id: id
    })

    ctx.body = {
      movies
    }
  }
}
// 暴露router
module.exports = router