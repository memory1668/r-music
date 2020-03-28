let curPage = 1
let totalPage = 0
// pages/charts/charts.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chartsList: [],
    coverImgUrl: 'http://p1.music.126.net/GhhuF6Ep5Tq9IEvLsyCN7w==/18708190348409091.jpg',
    isEnd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this._getCharts()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(curPage > totalPage){
      this.setData({
        isEnd: true
      })
      return
    }
    this._getCharts()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 获取热歌榜
   */
  _getCharts() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        curPage,
        start: this.data.chartsList.length,
        count: 28,
        $url: 'charts'
      }
    }).then(res => {
      console.log('获取热歌榜成功', res)
      if(curPage === 1){
        // 先清空
        this.setData({
          chartsList: []
        })
      }
      this.setData({
        chartsList: this.data.chartsList.concat(res.result.chartsList),
      })
      this._setMusicList()
      curPage ++
      totalPage = res.result.totalPage
      wx.hideLoading()
    }).catch(error => {
      console.log('获取热歌榜失败', error)
      wx.hideLoading()
    })
  },

  /**
   * 将当前热歌榜列表存储在缓存
   */
  _setMusicList() {
    wx.setStorageSync('musiclist', this.data.chartsList)
  }
})