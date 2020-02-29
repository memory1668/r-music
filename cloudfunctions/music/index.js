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

  // 搜索歌曲
  app.router('search', async(ctx, next) => {
    ctx.body = new Promise((resolve, reject)=> {
      axios.get(`${BASE_URL}/search?keywords= ${event.keyword}`).then(res => {
        console.log('搜索歌曲成功', res)
        resolve(res)
      }).catch(err => {
        console.log('搜索歌曲失败', err)
        reject(err)
      })
    })
    // ctx.body = await rp(`${BASE_URL}/search?keywords= ${event.keyword}`)
    //   .then(async(res) => {
    //     const songs = JSON.parse(res).result.songs
    //     let songsFmt = []
    //     console.log('搜索歌曲成功', error)
        // for (let i = 0; i < songs.length; i++) {
        //   // 获取专辑信息
        //   const album = await rp(`${BASE_URL}/album?id=${songs[i].album.id}`).then(res => {
        //     console.log('获取专辑信息' + res)
        //     const al = JSON.parse(res).songs[0].al
        //     return {
        //       name: al.name, // 专辑名称
        //       picUrl: al.picUrl //专辑图
        //     }
        //   })
        //   // 选择需要的字段返回
        //   songsFmt = songs.map(item => {
        //     return {
        //       id: item.id,
        //       name: item.name, // 歌曲名称
        //       al: album,
        //       ar: item.artists.map(item => {
        //         return {
        //           name: item.name
        //         }
        //       })
        //     }
        //   })
        // }
  //       return songsFmt
  //     })
  //     .catch(error => {
  //       console.log('搜索歌曲失败', error)
  //       throw error
  //     })
  })

  return app.serve()
}