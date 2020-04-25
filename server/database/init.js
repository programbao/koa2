const mongoose = require('mongoose')
// 数据库的地址
const db = 'mongodb://localhost/douban-trailer'
// 连接参数
const pa = {
  useUnifiedTopology: true,
  useNewUrlParser: true
}
mongoose.Promise = global.Promise

// 导出链接 --- 方法
exports.connect = () => {
  // 连接错误的次数
  let maxConnectTimes = 0

  // 这里要写一个promise，是为了保证，数据库无论是否连接了数据库；都要保证后边的代码能够执行
  return new Promise((resolve, reject) => {

    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    // 链接数据库
    mongoose.connect(db, pa)

    // 监听数据库的连接
    // 监听断开连接
    mongoose.connection.on('disconnected', () => {
      if (maxConnectTimes < 5) {
        // 重新连接
        mongoose.connect(db, pa)
      } else {
        throw new Error('数据库挂了吧，快去维修吧程序员')
      }
    })

    // 错误监听
    mongoose.connection.on('error', err => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        // 重新连接
        mongoose.connect(db, pa)
      } else {
        throw new Error('数据库挂了吧，快去维修吧程序员')
      }
    })
    // 错误监听
    mongoose.connection.once('open', () => {
      const Dog = mongoose.model('Dog', {
        name: String
      })
      const doga = new Dog({
        name: 'programbao'
      })

      doga.save().then(() => {
        console.log('保存成功');

      })
      resolve()
      console.log('MongoDB Connected successfully');
    })
  })
}