// miniprogram/pages/recommend/recommend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecommendList()
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

  /**
   * 获取每日推荐歌曲列表
   */
  getRecommendList() {
    wx.showLoading()
    const cookie = wx.getStorageSync('cookie')
    if (!cookie) {
      wx.redirectTo({
        url: '/pages/netease-auth/netease-auth'
      })
      return
    }

    wx.cloud.callFunction({
      name: 'music',
      data: {
        cookie,
        $url: 'recommend'
      }
    }).then(res => {
      console.log('推荐歌曲', res)
      const result = typeof res.result === 'string' ? JSON.parse(res.result) : res.result
      console.log('result', result, typeof res.result)
      // 没登录
      if (result.code === 301) {
        console.log('没登录', result)
        wx.redirectTo({
          url: '/pages/netease-auth/netease-auth'
        })
      }
      this.setData({
        musiclist: result.recommend
      })
    }).catch(err => {
      console.log('获取推荐歌曲失败', err)
    }).finally(() => {
      wx.hideLoading({})
      wx.stopPullDownRefresh({})
    })
  }
})