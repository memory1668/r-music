// miniprogram/pages/new-song/new-song.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [] //最新音乐列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNewsongs()
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

  getNewsongs() {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'newsongs'
      }
    }).then(res=>{
      console.log('获取最新歌曲成功', res)
      const musiclist = []
      res.result.data.forEach(item=>{
        musiclist.push(item.song)
      })
      this.setData({
        musiclist
      })
      wx.hideLoading()
    }).catch(err=>{
      console.log('获取最新歌曲失败', err)
      wx.hideLoading()
    })
  }
})