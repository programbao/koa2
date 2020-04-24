// 发起请求的库 --- 支持await来调用
const rp = require('request-promise-native')

async function fetchMovie(item) {
  const url = `https://api.douban.com/v2/movie/subject/${item.doubanId}?apikey=0df993c66c0c636e29ecbb5344252a4a`

  // rp处理请求await数据
  const res = await rp(url)

  return res
};
(async () => {
  let movies = [{
      doubanId: 1292052,
      title: '肖申克的救赎',
      rate: 9,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p480747492.jpg'
    },
    {
      doubanId: 1291561,
      title: '千与千寻',
      rate: 9,
      poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2557573348.jpg'
    }
  ]

  // 遍历传入item
  movies.map(async movie => {
    let movieData = await fetchMovie(movie)
    // 捕获一下数据
    try {
      movieData = JSON.parse(movieData)
      console.log(movieData.tags);
      console.log(movieData.summary);
    } catch (err) {
      console.log(err);
    }
  })
})()