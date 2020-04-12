// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const rp = require('request-promise')

// 获取最新专辑的接口
const URL = 'http://musicapi.xiecheng.live/album/newest'
// 初始化云数据库
const db = cloud.database()
// 专辑集合
const albumCollection = db.collection('album')

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  // 获取集合的记录数
  const countResult = await albumCollection.count()
  const total = countResult.total

  // 每次读取集合的最大限制数量
  const MAX_LIMIT = 100
  // 批量获取的次数
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  // 保存promise任务
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = albumCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
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

  // 待插入的新歌单数据
  const newList = []
  // 获取新专辑数据
  const albumList = await rp(URL).then((res) => {
    console.log('获取新专辑数据', JSON.parse(res).albums)
    return JSON.parse(res).albums
  })
  // 去重
  for (let i = 0, len1 = albumList.length; i < len1; i++) {
    // 是否有新插入的专辑数据
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (albumList[i].id === list.data[j].id) {
        flag = false
        break
      }
    }
    // 插入新专辑
    if (flag) {
      newList.push(albumList[i])
    }
    // 更新歌单
  }
  // 插入新歌单
  for (let i = 0, len = newList.length; i < len; i++) {
    await albumCollection.add({
      data: {
        ...newList[i],
        createTime: db.serverDate()
      }
    }).then((res) => {
      console.log('插入专辑数据成功', res)
    }).catch(() => {
      console.log('插入专辑数据失败')
    })
  }
  return '新插入' + newList.length + '条专辑数据'
}