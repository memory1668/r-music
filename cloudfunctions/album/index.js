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

  // 分页获取专辑信息
  app.router('getAlbumList', async (ctx, next) => {
    // 将要返回的数据保存在body
    ctx.body = await cloud.database().collection('album')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        console.log('获取专辑信息成功', res)
        return res
      })
  })

  // 获取专辑详情
  app.router('detail', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + `/album?id=${event.id}`).then(res => {
      console.log('获取专辑详情成功', res)
      return {
        code: 200,
        msg: 'success',
        data: []
      }
      // return JSON.parse(res).songs[0].al
    }).catch(err => {
      console.log('获取专辑详情失败', err)
      return {
        code: 500,
        msg: '获取专辑详情失败'
      }
    })
  })

  return app.serve()
}