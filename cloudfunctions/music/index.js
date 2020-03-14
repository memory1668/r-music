// 云函数入口文件
const cloud = require('wx-server-sdk')
// 引入tcb-router
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const axios = require('axios')
const BASE_URL = 'http://musicapi.xiecheng.live'


cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })

  // 分页获取歌单信息
  app.router('getPlayList', async(ctx, next) => {
    // 将要返回的数据保存在body
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        return res
      })
  })

  // 获取歌曲列表
  app.router('musiclist', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then((res) => {
        return JSON.parse(res)
      })
      .catch(error => {
        console.log('获取歌曲列表失败', error)
        throw error
      })
  })

  // 获取音乐详情
  app.router('musicUrl', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + `/song/url?id=${event.musicId}`).then(res => {
      return res
    })
  })

  // 获取音乐详情
  app.router('detail', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/song/detail?ids=${event.musicId}`).then(res => {
      return JSON.parse(res).songs[0].al
    })
  })

  // 获取歌词
  app.router('lyric', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + `/lyric?id=${event.musicId}`).then(res => {
      return res
    })
  })

  // 获取热歌榜
  app.router('charts', async(ctx, next) => {
    ctx.body = await rp(BASE_URL + '/top/list?idx=1')
      .then((res) => {
        return JSON.parse(res)
      })
      .catch(error => {
        console.log('获取热歌榜失败', error)
        throw error
      })
  })
  return app.serve()
}