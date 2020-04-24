// 模拟同步的过程
const doSync = (sth, time) => new Promise(resolve => {
  setTimeout(() => {
    console.log(sth + '用了' + time + '毫秒');
    resolve()
  }, time)
})

// 模拟异步的过程
const doAsync = (sth, time, cb) => {
  setTimeout(() => {
    console.log(sth + '用了' + time + '毫秒');
    cb && cb()
  }, time)
}


const doElse = (sth) => {
  console.log(sth);

}

const bao = {
  doSync,
  doAsync
};
const program = {
  doSync,
  doAsync,
  doElse
};
(async () => {

  // 同步过程
  console.log('case 1: 妹子来到门口')
  await bao.doSync('bao 刷牙', 1000)
  console.log('啥都没有干， 一直等');
  await program.doSync('妹子洗澡', 2000)
  program.doElse('妹纸去忙别的了');

  // 异步过程
  console.log('case 3: 妹子来到门口按一下通知开关')
  bao.doAsync('bao 在刷牙', 1000, () => {
    console.log('卫生间通知妹纸来洗澡');
    program.doAsync('妹纸来洗澡', 2000)
  })
  program.doElse('妹纸去忙别的了');
})()