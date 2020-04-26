import {
  mongoose
} from "mongoose";
const Movie = mongoose.model('Movie')
export const getAllMovies = async (type, year) => {
  let query = {}
  if (type) {
    // 设置匹配规则
    query.movieTypes = {
      $in: [type]
    }
  }
  if (year) {
    query.year = year
  }

  const movies = await Movie.find(query)
  return movies
}

export const getMovieDetail = async (id) => {
  const movie = await Movie.find({
    _id: id
  })
  return movie
}

export const getRelativeMovies = async (movie) => {
  const movies = await Movie.find({
    movieTypes: {
      $in: movie.movieTypes
    }
  })
  return movies
}