const cp = require('child_process') // 子进程
const {
  resolve
} = require('path');
(async () => {
  const script = resolve(__dirname, '../crawler/trailer-list.js')
  // 子进程对象 --- 参数一： 爬虫脚本 ; 
  const child = cp.fork(script, [])
  // 调用的辨识符 --- 表示脚本有没有运行
  let invoked = false
  // 监听错误
  child.on('error', err => {
    // 如果调用过
    if (invoked) return
    invoked = true
    console.log(err)
  })

  child.on('exit', code => {
    if (invoked) return
    invoked = true
    let err = code === 0 ? null : new Error('exit code' + code)
    console.log(err)
  })

  // 监听消息
  child.on('message', data => {
    let result = data.result
    console.log(result)
  })
})()