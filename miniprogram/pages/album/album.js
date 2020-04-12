// miniprogram/pages/album/album.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAlbumList()
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
   * 获取专辑列表
   */
  getAlbumList() {
    wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: 'album',
      data: {
        start: this.data.albumList.length,
        count: 10,
        $url: 'getAlbumList'
      }
    }).then(res => {
      console.log('获取专辑列表成功', res)
      if (res.result.errMsg !== 'collection.get:ok') {
        console.log('获取专辑列表失败', res.errMsg)
        wx.showToast({
          title: '获取专辑列表失败',
          icon: 'none'
        })
        return
      }
      this.setData({
        albumList: this.data.albumList.concat(res.result.data)
      })
      wx.hideLoading({})
      wx.stopPullDownRefresh({})
    }).catch(err => {
      console.log('获取专辑列表失败', err)
      wx.showToast({
        title: '获取专辑列表失败',
        icon: 'none'
      })
    })
  },

  goAlbunDetail(e) {
    // console.log(e)
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/album/album-detail/album-detail?id='+id
    })
  }
})