// 云函数入口文件
const cloud = require('wx-server-sdk')
// 引入tcb-router
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const BASE_URL = 'http://musicapi.xiecheng.live'
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })
  // 分页获取热门歌手信息
  app.router('getSingerList', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/top/artists?offset=${event.start}&limit=${event.count}`).then(res => {
      console.log('获取热门歌手成功', res)
      return {
        code: 200,
        msg: 'success',
        data: JSON.parse(res).artists
      }
    }).catch(err => {
      console.log('获取热门歌手失败', err)
      return {
        code: 500,
        msg: '获取热门歌手失败'
      }
    })
  })
  // 获取歌手热门歌曲
  app.router('getHotSong', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/artists?id=${event.id}`).then(res => {
      console.log('获取歌手热门歌曲成功', res)
      return {
        code: 200,
        msg: 'success',
        data: JSON.parse(res).hotSongs
      }
    }).catch(err => {
      console.log('获取歌手热门歌曲失败', err)
      return {
        code: 500,
        msg: '获取歌手热门歌曲失败'
      }
    })
  })
  // 获取歌手专辑
  app.router('getAlbum', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/artist/album?id=${event.id}`).then(res => {
      console.log('获取歌手专辑', res)
      return {
        code: 200,
        msg: 'success',
        data: JSON.parse(res).hotAlbums
      }
    }).catch(err => {
      console.log('获取歌手专辑失败', err)
      return {
        code: 500,
        msg: '获取歌手专辑失败'
      }
    })
  })
  return app.serve()
}