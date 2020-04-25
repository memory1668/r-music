// miniprogram/pages/singer/singer-detail/singer-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singer: {},
    active: 0,
    musiclist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSingerInfo(options.index)
    this.getHotSong()
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
   * 获取缓存中的歌手信息
   */
  getSingerInfo(index) {
    const singer = wx.getStorageSync('singerList')[index]
    this.setData({
      singer
    })
  },
  /**
   * 获取歌手热门歌曲
   */
  getHotSong() {
    wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: 'singer',
      data: {
        id: this.data.singer.id,
        $url: 'getHotSong'
      }
    }).then(res => {
      console.log('获取歌手热门歌曲成功', res)
      if (res.result.code !== 200) {
        console.log('获取歌手热门歌曲失败', res)
        wx.showToast({
          title: '获取歌手热门歌曲失败',
          icon: 'none'
        })
        return
      }
      const musiclist = res.result.data
      this.setData({
        musiclist
      })
      wx.hideLoading({})
      wx.stopPullDownRefresh({})
    }).catch(err => {
      console.log('获取歌手热门歌曲失败', err)
      wx.showToast({
        title: '获取歌手热门歌曲失败',
        icon: 'none'
      })
    })
  }
})