// miniprogram/pages/singer/singer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singerList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSingerList()
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
    this.getSingerList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取热门歌手列表
   */
  getSingerList() {
    wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: 'singer',
      data: {
        start: this.data.singerList.length,
        count: 50,
        $url: 'getSingerList'
      }
    }).then(res => {
      console.log('获取热门歌手列表成功', res)
      if (res.result.code !== 200) {
        console.log('获取热门歌手列表失败', res)
        wx.showToast({
          title: '获取热门歌手列表失败',
          icon: 'none'
        })
        return
      }
      const singerList = res.result.data
      this.setData({
        singerList: this.data.singerList.concat(singerList)
      })
      wx.setStorageSync('singerList', this. data.singerList)
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

  goSingerDetail(e) {
    const id = e.currentTarget.dataset.id // 歌手id
    const index = e.currentTarget.dataset.index // 当前点击的歌手索引
    wx.navigateTo({
      url: `/pages/singer/singer-detail/singer-detail?id=${id}&index=${index}`
    })
  }
})