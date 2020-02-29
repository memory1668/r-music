// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const rp = require('request-promise')

// 获取歌单的接口
const baseURL = 'http://musicapi.xiecheng.live'

// 初始化云数据库
const db = cloud.database()
// 轮播图集合
const swiperCollection = db.collection('swiper')

// 云函数入口函数
// 每天定时触发， 获取轮播图
exports.main = async(event, context) => {
  // 获取集合的记录数
  const countResult = await swiperCollection.count()
  const total = countResult.total

  // 每次读取集合的最大限制数量
  const MAX_LIMIT = 100
  // 批量获取的次数
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 保存promise任务
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = swiperCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 保存从数据库获取的数据
  let list = {
    data: []
  }

  if (tasks.length > 0) {
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  // 待插入的轮播图数据
  const newList = []
  // 获取新轮播图数据
  const swiperList = await rp(`${baseURL}` + '/banner').then((res) => {
    const banners = JSON.parse(res).banners
    // console.log('获取新轮播图数据res', banners)
    const data = []
    for (let i = 0, len = banners.length; i < len; i++) {
      if (banners[i].targetType === 1) {
        data.push(banners[i])
      }
    }
    // console.log('获取新轮播图数据data', data)
    return data
  })

  // 去重
  for (let i = 0, len1 = swiperList.length; i < len1; i++) {
    // 是否有新插入的歌单数据
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (swiperList[i].targetId === list.data[j].musicId) {
        flag = false
        break
      }
    }
    // 插入新歌单
    if (flag) {
      newList.push(swiperList[i])
    }
    // 更新歌单
  }

  const swiperShow = []
  for (let i = 0, len = newList.length; i < len; i++) {
    // 插入新数据到swiper集合
    await swiperCollection.add({
      data: {
        ...newList[i],
        createTime: db.serverDate()
      }
    }).then((res) => {
      console.log('插入swiper数据成功')
    }).catch((err) => {
      console.log('插入swiper数据失败', err)
    })
    // 获取swiper对应的歌曲名称和专辑图
    const detail = await rp(`${baseURL}/song/detail?ids=${newList[i].targetId}`).then(res => {
      return JSON.parse(res).songs[0]
    })
    swiperShow.push({
      imageUrl: newList[i].imageUrl,
      music: {
        ...detail
      }
    })
  }
  console.log('swiperShow', swiperShow)



  // 将要显示的swiper插入到集合swiper-show
  for (let i = 0, len = swiperShow.length; i < len; i++) {
    // 插入新数据到swiper集合
    await db.collection('swiper-show').add({
      data: {
        ...swiperShow[i],
        createTime: db.serverDate()
      }
    }).then((res) => {
      console.log('将要显示的swiper插入到集合swiper-show成功')
    }).catch((err) => {
      console.log('将要显示的swiper插入到集合swiper-show失败', err)
    })
  }
  // // 插入新歌单
  // for (let i = 0, len = newList.length; i < len; i++) {
  //   await playListCollection.add({
  //     data: {
  //       ...newList[i],
  //       createTime: db.serverDate()
  //     }
  //   }).then((res) => {
  //     console.log('插入歌单数据成功')
  //   }).catch(() => {
  //     console.log('插入歌单数据失败')
  //   })
  // }
  // return '新插入' + newList.length + '条歌单数据'
}