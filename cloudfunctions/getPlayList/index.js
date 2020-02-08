/*
 * @Author: your name
 * @Date: 2019-11-24 09:40:42
 * @LastEditTime: 2019-11-29 09:07:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ruankj-bloge:\miniprogram\music\cloudfunctions\getPlayList\index.js
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const rp = require('request-promise')

// 获取歌单的接口
const URL = 'http://musicapi.xiecheng.live/personalized'

// 初始化云数据库
const db = cloud.database()
// playList集合
const playListCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
  // 获取数据库的旧歌单数据
  // const list = await playListCollection.get()

  // 获取集合的记录数
  const countResult = await playListCollection.count()
  const total = countResult.total

  // 每次读取集合的最大限制数量
  const MAX_LIMIT = 100
  // 批量获取的次数
  const batchTimes = Math.ceil(total/MAX_LIMIT)
  // 保存promise任务
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = playListCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 保存从数据库获取的数据
  let list = {
    data: []
  }

  if(tasks.length > 0){
    list = (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }
  
  // 待插入的新歌单数据
  const newList = []
  // 获取新歌单数据
  const playList = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  // 去重
  for (let i = 0, len1 = playList.length; i<len1; i++){
    // 是否有新插入的歌单数据
    let flag = true
    for (let j = 0, len2 = list.data.length; j < len2; j++) {
      if (playList[i].id === list.data[j].id){
        flag = false
        break
      }
    }
    // 插入新歌单
    if(flag){
      newList.push(playList[i])
    }
    // 更新歌单
  }
  // 插入新歌单
  for (let i = 0, len = newList.length; i < len; i++){
    await playListCollection.add({
      data: {
        ...newList[i],
        createTime: db.serverDate()
      }
    }).then((res)=>{
      console.log('插入歌单数据成功')
    }).catch(()=>{
      console.log('插入歌单数据失败')
    })
  }
  return '新插入' + newList.length + '条歌单数据'
}