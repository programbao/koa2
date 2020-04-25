// 发起请求的库 --- 支持await来调用
const rp = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');
async function fetchMovie(item) {
  const url = `https://api.douban.com/v2/movie/${item.doubanId}?apikey=0df993c66c0c636e29ecbb5344252a4a`

  // rp处理请求await数据
  const res = await rp(url)

  let body
  try {
    body = JSON.parse(res)
  } catch(err) {
    console.log(err);
    
  }
  return body
};
(async () => {
  // 通过$or 来匹配条件 --- 匹配不完整的字段
  let movies = await Movie.find({
    $or: [{
        summary: {
          $exists: false
        }
      },
      {
        summary: null
      },
      {
        title: ''
      },
      {
        summary: ''
      },
      {
        year: {
          $exists: false
        }
      }
    ]
  })
  // 补上缺失的内容
  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    
    
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []
      // 将有用数据补充上去
      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''
      // 判断data上面的属性
      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2500
        for (let i = 0; i < movie.movieTypes.length; i++) {
          let item = movie.movieTypes[i]
          let cat = await Category.findOne({
            name: item
          })

          if (!cat) {
            cat = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            // 如果分类里面没有保存电影id 的话
            if (cat.movies.indexOf(movie._id) === -1) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()

          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (movie.category.indexOf(cat._id) === -1) {

              movie.category.push(cat._id)
            }
          }
        }
        // 补上电影的上映日期
        let dates = movieData.attrs.pubdate || []
        let pubdates = []
        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'
            if (parts[1]) {
              country = parts[1].split(')')[0]
            }
            pubdates.push({
              date: new Date(date),
              country
            })
          }

        })

        // 将预告存入数据
        movie.pubdate = pubdates

      }

      tags.forEach(tag => {
        movie.tags.push(tag.name)
      })

      await movie.save()
    }
  }


})()