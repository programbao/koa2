const mongoose = require('mongoose')
// 密码库
const bcrypt = require('bcrypt-nodejs')
// 用于描述整个类型需要什么字段，这个字段是什么类型
const Schema = mongoose.Schema
// mixed 使用与数据变化比较频繁的场景 --- 可以存储任何类型的数据
const Mixed = Schema.Types.Mixed
// 密码承重
const SALT_WORK_FACTOR = 10
// 密码最多登录次数
const MAX_LOGIN_ATTEMPTS = 5
// 锁定时间
const LOCK_TIME = 2 * 60 * 60 * 1000

// unique 表示数据是唯一的
const userSchema = new Schema({
  usrname: {
    unique: true,
    required: true,
    type: String
  },
  email: {
    unique: true,
    required: true,
    type: String
  },
  password: {
    unique: true,
    required: true,
    type: String
  },
  lockUntil: Number, // 锁定时间
  // 尝试登录次数
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
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

// 创建一个虚拟字段
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})
// 最新时间更新
userSchema.pre('save', function (next) {
  // 判断当前的实体数据是不是新的
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})
// 密码加严
userSchema.pre('save', function (next) {
  // 判断密码是否变化了
  if (!user.isModified('password')) return next()
  // 加严加密后生成密码
  // 加密库 --- bcrypt
  /**
   * @param SALT_WORK_FACTOR --- 构建加密严的称重
   * */
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)
    // 如果没有错误的话，对密码进行hash值加密
    /**
     * @param 参数一 要加密的密码
     * @param 参数一 生成加密的指纹
     * */
    bcrypt.hash(user.password, salt, (error, hash) => {
      if (error) return next(error)
      this.password = hash
      next()
    })
  })
})


// methods 是实例方法 --- 可修改数据库
// 密码比较
userSchema.methods = {
  /**
   * @param _password 用户传过来的密码
   * @param password 数据库中的密码
   * */
  comparePassword: (_password, password) => {

    return new Promise((resolve, reject) => {
      /**
       * @param isMatch 是否是true，来判断对比密码是否有错误
       * */
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch)
        else reject(err)
      })
    })
  },

  // 判断用户是否操作了登录次数 --- 来进行锁定
  incLoginAttepts: (user) => {
    return new Promise((resolve, reject) => {
      if (this.lockUntil && this.lockUntil < Date.now()) {
        this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, (err) => {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }
        // 这里表示当前用户没有被锁定  并且 登录尝试次数超过了最大次数
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
          updates.$set = {
            // 锁定用户
            lockUntil: Date.now() + LOCK_TIME
          }
        }


        this.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  }
}

// 用户模型
mongoose.model('User', userSchema)