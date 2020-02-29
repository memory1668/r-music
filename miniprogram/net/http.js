module.exports = {
  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        method: options.method ? options.method : 'GET',
        success: (res) => {
          resolve(res.data)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}