const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicList: [] // 历史播放列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadPlayHistory()
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
   * 加载播放的历史列表
   */
  _loadPlayHistory() {
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    if(history.length == 0){
      wx.showToast({
        title: '无播放记录',
      })
    }
    // 调整当前的播放列表
    wx.setStorage({
      data: history,
      key: 'musiclist'
    })
    this.setData({
      musicList: history
    })
  }
})