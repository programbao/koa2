const mongoose = require('mongoose')
// 用于描述整个类型需要什么字段，这个字段是什么类型
const Schema = mongoose.Schema
// mixed 使用与数据变化比较频繁的场景 --- 可以存储任何类型的数据
const ObjectId = Schema.Types.ObjectId

/**
 * movies 中的的ref 是引用关系/指向关系/指向模型
 * */
const categorySchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
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
categorySchema.pre('save', next => {
  // 判断当前的实体数据是不是新的
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
// 电影模型
mongoose.model('Category', categorySchema)