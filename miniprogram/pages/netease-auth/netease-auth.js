// miniprogram/pages/netease-auth/netease-auth.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  checkChange() {
    this.setData({
      checked: !this.data.checked
    })
  },

  /**
   * 登录
   */
  handleSubmit(e) {
    const phone = e.detail.value.phone
    const password = e.detail.value.password
    wx.cloud.callFunction({
      name: 'auth',
      data: {
        phone,
        password,
        $url: 'getPlayList'
      }
    }).then(res => {
      console.log('登录成功', res)
      const result = typeof res.result === 'string' ? JSON.parse(res.result) : res.result
      if (result.code === 502 || result.code !== 200) {
        wx.showToast({
          title: result.msg ? result.msg : '登录失败，请重试',
          icon: 'none'
        })
        return
      }
      this.setCookie(result.cookie)
      wx.redirectTo({
        url: '/pages/recommend/recommend'
      })
    }).catch(err => {
      console.log('登录失败', err)
    })
  },

  /**
   * 保存cookie在缓存
   */
  setCookie(cookie) {
    wx.setStorageSync('cookie', cookie)
  }
})