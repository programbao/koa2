const mongoose = require('mongoose')
// 用于描述整个类型需要什么字段，这个字段是什么类型
const Schema = mongoose.Schema
// mixed 使用与数据变化比较频繁的场景 --- 可以存储任何类型的数据
const Mixed = Schema.Types.Mixed
const movieSchema = new Schema({
  doubanId: {
    unique: true,
    type: String
  },
  rete: Number,
  title: String,
  summary: String,
  video: String,
  poster: String,
  cover: String,

  videoKey: String,
  movieKey: String,
  coverKey: String,


  rawTitle: String,
  movieTypes: [String],
  pubdate: Mixed,
  year: Number,
  tages: Array,

  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    },
  }
})

// 中间件的处理调用 --- 可以对单条数据进行操作
movieSchema.pre('save', next => {
  // 判断当前的实体数据是不是新的
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
// 电影模型
mongoose.model('Movie', movieSchema)