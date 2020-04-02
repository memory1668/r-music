// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
const request = require('request')
const BASE_URL = 'http://musicapi.xiecheng.live'

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  // // 网易云账号登录
  // const result = await rp(BASE_URL + `/login/cellphone?phone=${event.phone}&password=${event.password}`).then(res => {
  //   const reuslt = JSON.parse(res)
  //   if (reuslt.code === 200) {
  //     console.log('登录成功', reuslt)
  //     return {
  //       code: 200,
  //       msg: '登录成功'
  //     }
  //   }
  // }).catch(err => {
  //   console.log('登录失败', err.error)
  //   return err.error
  //   // throw err
  // })
  // return result

  var options = {
    uri: BASE_URL + `/login/cellphone?phone=${event.phone}&password=${event.password}`,
    transform: function (body, res, resolveWithFullResponse) {
      // return res['headers']['set-cookie']
      return res['headers']['set-cookie']
    }
  };

  const result = await rp(options).then(res => {
    console.log('登录成功', res)
    return {
      code: 200,
      msg: 'success',
      cookie: res
    }
  }).catch(err => {
    console.log('登录失败', err)
    return err.error
  })
  return result
}