// 云函数入口文件
const cloud = require('wx-server-sdk')
// 引入tcb-router
const TcbRouter = require('tcb-router')
const rp = require('request-promise')
const axios = require('axios')
const BASE_URL = 'http://musicapi.xiecheng.live'


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  // 分页获取歌单信息
  app.router('getPlayList', async (ctx, next) => {
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
  app.router('musiclist', async (ctx, next) => {
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
  app.router('musicUrl', async (ctx, next) => {
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
  app.router('lyric', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/lyric?id=${event.musicId}`).then(res => {
      return res
    })
  })

  // 获取热歌榜
  app.router('charts', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/top/list?idx=1')
      .then((res) => {
        const list = JSON.parse(res).playlist.tracks
        console.log('获取热歌榜', list)
        const totalPage = Math.ceil(list.length / event.count)
        let resList = []
        // 加载最后一页数据
        if (event.curPage === totalPage) {
          resList = list.slice(event.start, list.length)
        } else {
          resList = list.slice(event.start, event.start + event.count)
        }
        return {
          chartsList: resList,
          total: list.length,
          totalPage: totalPage
        }
      })
      .catch(error => {
        console.log('获取热歌榜失败', error)
        throw error
      })
  })

  // 获取推荐歌曲
  app.router('recommend', async (ctx, next) => {
    console.log('推荐歌曲');
    const cookie = event.cookie
    // ctx.body = await rp(BASE_URL + '/recommend/songs')
    //   .then((res) => {
    //     const reuslt = JSON.parse(res)
    //     if (reuslt.code === 301) {
    //       console.log('获取推荐歌曲失败', reuslt.msg)
    //       return {
    //         code: 301,
    //         msg: reuslt.msg
    //       }
    //     } else {
    //       return reuslt.recommend
    //     }
    //   })
    //   .catch(err => {
    //     console.log('获取推荐歌曲失败', err.error)
    //     // throw err.error
    //     return err.error
    //   })
    let cookie_2 = rp.cookie(cookie[0]);
    console.log(cookie_2);
    let cookie_1 = rp.cookie(cookie[1]);
    console.log(cookie_1);
    let cookie_0 = rp.cookie(cookie[2]);
    console.log(cookie_0);
    let cookiejar = rp.jar();
    cookiejar.setCookie(cookie_2, BASE_URL);
    cookiejar.setCookie(cookie_1, BASE_URL);
    cookiejar.setCookie(cookie_0, BASE_URL);
    let options = {
      uri: BASE_URL + '/recommend/songs',
      method: 'GET',
      jar: cookiejar
    };
    ctx.body = await rp(options).then(res => {
      console.log('推荐歌曲成功', res);
      const reuslt = JSON.parse(res)
      if (reuslt.code === 200) {
        return {
          code: 200,
          msg: 'success',
          recommend: reuslt.recommend
        }
      } else {
        return {
          code: 500,
          msg: reuslt
        }
      }
    }).catch(err => {
      console.log('推荐歌曲失败', err);
      return err.error
    })
  })

  // 获取最新歌曲
  app.router('newsongs', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/personalized/newsong')
      .then((res) => {
        console.log('获取最新歌曲成功', res)
        const result = JSON.parse(res).result
        return {
          code: 200,
          msg: 'success',
          data: result,
        }
        // const totalPage = Math.ceil(list.length / event.count)
        // let resList = []
        // // 加载最后一页数据
        // if (event.curPage === totalPage) {
        //   resList = list.slice(event.start, list.length)
        // } else {
        //   resList = list.slice(event.start, event.start + event.count)
        // }
        // return {
        //   chartsList: resList,
        //   total: list.length,
        //   totalPage: totalPage
        // }
      })
      .catch(error => {
        console.log('获取最新歌曲失败', error)
        return {
          code: 500,
          msg: '获取最新歌曲失败'
        }
        // throw error
      })
  })
  return app.serve()
}