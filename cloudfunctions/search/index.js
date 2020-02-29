// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
const axios = require('axios')

const BASE_URL = 'http://musicapi.xiecheng.live'


cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    try {
      request({
        uri: `${BASE_URL}/search?keywords=千百度`,
        headers: {
          'Content-Type': "application/x-www-form-urlencoded; charset=utf-8"
        }
      }, (err, resp, body) => {
        if (err) {
          return reject(err)
        }
        return resolve(body)
      })
    } catch (e) {
      return reject(err)
    }
  })
}