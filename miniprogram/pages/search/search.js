// pages/search/search.js
import {
  search
} from '../../net/search.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicList: [] // 搜索的歌曲列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 搜索歌曲，前30首
   */
  onSearch(event) {
    const keyword = event.detail.keyword
    if (keyword.trim() === '') {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '加载中',
    })

    search(keyword).then(res => {
      console.log('搜索成功', res)
      this.setData({
        musicList: res
      })
      this._setMusicList()
      wx.hideLoading()
    }).catch(err => {
      console.log('搜索失败', error)
      wx.hideLoading()
    })
  },

  /**
   * 将当前热歌榜列表存储在缓存
   */
  _setMusicList() {
    wx.setStorageSync('musiclist', this.data.musicList)
  }
})