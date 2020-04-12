// miniprogram/pages/album/album-detail/album-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAlbumDetail(options.id)
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

  getAlbumDetail(id) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'album',
      data: {
        id,
        $url: 'detail'
      }
    }).then(res => {
      if (res.result.code !== 200) {
        console.log('获取专辑详情失败', res.errMsg)
        wx.showToast({
          title: '获取专辑详情失败',
          icon: 'none'
        })
        return
      }
      console.log('获取专辑详情成功', res)
      this.setData({
        albumList: this.data.albumList.concat(res.result.data)
      })
      wx.hideLoading({})
      wx.stopPullDownRefresh({})
    }).catch(err => {
      console.log('获取专辑详情失败', err)
      wx.showToast({
        title: '获取专辑详情失败',
        icon: 'none'
      })
    })
  }
})