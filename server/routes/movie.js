import {
  controller,
  get,
  post,
  put
} from "../lib/decorator";
import {
  getAllMovies,
  getRelativeMovies,
  getMovieDetail
} from "../service/movie";
// 控制器装饰器
@controller('/api/v0/movies')
export class movieController {
  @get('/')
  async getMovies(ctx, next) {
    const {
      type,
      year
    } = ctx.query
    const movies = await getAllMovies(type, year)

    ctx.body = {
      movies
    }
  }
  // 拿到单个数据 --- :id 表示id变量
  @get('/:id')
  async getMoviesDetail(ctx, next) {

    const id = ctx.params.id
    const movie = await getMovieDetail(id)
    const relativeMovies = await getRelativeMovies(movie)

    ctx.body = {
      data: {
        movie,
        relativeMovies
      },
      success: true
    }
  }
}