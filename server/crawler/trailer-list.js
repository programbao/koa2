/**
 * 引入puppeteer无头浏览器，可以模拟真实用户的访问
 * 可以抛出脚本来解析网页上的内容，提取目标数据
 *  */
const puppeteer = require('puppeteer')
const url = `https://movie.douban.com/tag/#/?sort=U&range=6,10&tags=`;

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
  await page.goto(url, {
    waitUntil: 'networkidle2' // 当网络空闲的时候---表示页面加载完毕
  })

  // 延时确保页面加载完毕
  await sleep(3000)

  // 等待按钮出现---这里awaitForSelector 是一个选择器
  await page.waitForSelector('.more')

  // 加载两页数据---执行一次点击
  for (let i = 0; i < 1; i++) {
    await sleep(3000)
    await page.click('.more')
  }

  // 加载完第二页后 --- 开始处理数据
  const result = await page.evaluate(() => {
    var $ = window.$ // 获取页面的jquery对象
    var items = $('.list-wp a') // 获取存储内容对象
    var links = [] //存储数据的数组

    // 确保数据不为空
    if (items.length >= 1) {
      items.each((index, item) => {
        let it = $(item) // 获取每个节点
        // 每个节点的id
        let doubanId = it.find('div').data('id')
        // 拿到标题
        let title = it.find('.title').text()
        // 拿到平级---评分--- '~~' 表示转为Number类型
        let rate = ~~it.find('.rate').text()
        // 拿到图片 --- 并且替换为高清图
        let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio')
        // 然后将数据加入到数组中
        links.push({
          doubanId,
          title,
          rate,
          poster
        })
      })
    }
    return links
  })

  // 拿到数据后关闭浏览器
  browser.close()
  console.log(result)
})()