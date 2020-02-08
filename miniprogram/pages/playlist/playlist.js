// pages/playlist/playlist.js
const MAX_LIMIT = 15 //每次获取15条歌单
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
      }
    ],
    playlist: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlayList()
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
    // 清空歌单数据
    // this.setData({
    //   playlist: []
    // })
    this.data.playlist = [] //不用更新视图
    this._getPlayList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlayList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 获取歌单列表
   */
  _getPlayList() {
    wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'getPlayList'
      }
    }).then(res => {
      console.log('获取歌单', res)
      if (res.result.errMsg !== 'collection.get:ok') {
        console.log('获取歌单数据失败', res.errMsg)
        wx.showToast({
          title: '获取歌单数据失败',
          icon: 'none'
        })
        return
      }
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      wx.hideLoading({})
      wx.stopPullDownRefresh({})
    })
  }
})