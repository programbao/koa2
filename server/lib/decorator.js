import Router from "koa-router"
import {
  resolve
} from 'path'
import {
  isArray
} from "util"
import _ from 'lodash'
import glob from 'glob'
// 声明一个symbol类型
const symbolPrefix = Symbol('prefix')

/**
 * 创建一个map对象 --- map 可以表示一个集合，而他的键可以是任何值（对象、字符串、数组）
 * 获取去的键可以用set属性来获取
 * */
const routerMap = new Map() // 创建一个空的集合

// 判断是否是数组 --- 如果不是的话就封装成数组
const isArray = c => _.isArray(c) ? c : [c]
export class Route {
  /**
   * @param app 当前的实例
   * @param apiPath 路由所在的目录
   * */
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }
  init() {
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)
    // 初始化时为所有的路由和中间件进行注册
    // 通过枚举类型拿到数据 --- 使用方式： 要获取的数据 of 获取数据的源
    for (let [conf, controller] of routerMap) {
      // 这里的controller之所以可以拿到是因为 routerMap中 target（类） 拿到的
      const controllers = isArray(controller)
      // 拿到中的唯一路径
      const prefixPath = conf.target[symbolPrefix]
      // 如果路径不为空的话 处理一下路径接口
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      // 拿到当前的path
      const routerPath = prefixPath + conf.path
      // 注册路由
      this.router[conf.method](routerPath, ...controllers)
    }

    this.app.use(this.router.routers())
    this.app.use(this.router.allowedMethods())
  }
}
// 处理路径
const normalizePath = path => path.startsWith('/') ? path : `/${path}`
// 路由装饰器 --- 处理路由路径 需要一个集合管理所有的路径 这个集合可以通过一个对象来实现（object）
const router = conf => (target, key, descriptor) => {
  conf.path = normalizePath(conf.path)
  // 调用routerMap.set 来设置对象中的每一个键值对
  /**
   * @param 参数一：键 --- {} 对象
   * @param 参数二：值 --- target[key] 类名中的每个方法
   * 说明 --- ...conf是对参数中的conf里面的数据进行平铺到对象中去
   * 例如： conf = {method: 'get',path: '/get'} 然后平铺到{tartget,...conf}，所以
   * 就相当于 {tartget,...conf} === {tartget,method: 'get',path: '/get'}
   * 
   * @param target[key] 中的key就相当于 健对象中的可以 引用上面的说明 key = target/method/path
   * */
  routerMap.set({
    target: target,
    ...conf
  }, target[key])
}
// 控制器装饰器
export const controller = path => target => (target.prototype[symbolPrefix] = path)

// 请求方法的装饰器
export const get = path => router({
  method: 'get',
  path: path
})
export const post = path => router({
  method: 'post',
  path: path
})
export const put = path => router({
  method: 'put',
  path: path
})
export const del = path => router({
  method: 'del',
  path: path
})

// 处理中间件
export const use = path => router({
  method: 'use',
  path: path
})

// 处理所有的请求
export const all = path => router({
  method: 'all',
  path: path
})