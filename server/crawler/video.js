/**
 * 引入puppeteer无头浏览器，可以模拟真实用户的访问
 * 可以抛出脚本来解析网页上的内容，提取目标数据
 *  */
const puppeteer = require('puppeteer')
const base = `https://movie.douban.com/subject/`
const doubanId = '1292052'
const videoBase = `https://movie.douban.com/trailer/260716/#content`;

// 延迟时间
const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})
// 自动执行的异步函数
;
(async () => {
  console.log('Start visit the target page')
  // 这里的browser 相当于一个你看不到的浏览器
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    dumpio: false
  })
  // 开启新页面
  const page = await browser.newPage()
  // 加载等待页面
  await page.goto(base + doubanId, {
    waitUntil: 'networkidle2' // 当网络空闲的时候---表示页面加载完毕
  })

  // 延时确保页面加载完毕
  await sleep(1000)

  // 加载完第二页后 --- 开始处理数据
  const result = await page.evaluate(() => {
    var $ = window.$ // 获取页面的jquery对象
    // 那视频封面图
    var it = $('.related-pic-video')
    // 判断是否有预告片
    if (it && it.length > 0) {
      // 跳转地址
      var link = it.attr('href')
      // 获取背景图片
      var cover = it.css("backgroundImage").replace('url(', '').replace(')', '');

      return {
        link,
        cover
      }
    }

    return {}
  })

  // 爬视频
  let video
  // 如果有跳转链接的话，就开始爬视频
  if (result.link) {
    await page.goto(result.link, {
      waitUntil: 'networkidle2'
    })
    await sleep(2000)

    video = await page.evaluate(() => {
      var $ = window.$
      var it = $('source')

      if (it && it.length > 0) {
        return it.attr('src')
      }

      return ''
    })
  }

  const data = {
    video,
    doubanId,
    cover: result.cover
  }
  // 拿到数据后关闭浏览器
  browser.close()

  // 将结果发送出去
  process.send(data)
  // 退出进程
  process.exit(0)
})()