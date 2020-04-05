// pages/musiclist/musiclist.js
import transCount from '../../utils/transCount.js'
let navtop = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [], // 音乐列表
    listInfo: {
      coverImgUrl: '',
      name: '',
      playCount: ''
    }, // 歌单信息
    isShowSticky: false,
    isShowTotop: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const playCount = "listInfo.playCount"
    this.setData({
      [playCount]: options.playCount
    })
    wx.showLoading({
      title: '加载中',
    })
    // 获取歌曲列表
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then(res => {
      console.log('musiclist', res)
      const pl = res.result.playlist
      this.setData({
        musiclist: pl.tracks,
        listInfo: {
          ...this.data.listInfo,
          coverImgUrl: pl.coverImgUrl,
          name: pl.name
        }
      })
      this._setMusicList()
      wx.hideLoading()
    }).catch(error => {
      console.log('获取歌曲列表失败', error)
      wx.hideLoading()
    })
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

  onPageScroll(e) {
    console.log('onPageScroll', e.scrollTop, navtop)
    if (e.scrollTop >= navtop && this.data.isShowSticky === false) {
      console.log('isShowSticky', this.data.isShowSticky)
      this.setData({
        isShowSticky: true
      })
    }else if(e.scrollTop < navtop && this.data.isShowSticky === true){
      this.setData({
        isShowSticky: false
      })
    }
    if(e.scrollTop > 2500 && this.data.isShowTotop === false){
      this.setData({
        isShowTotop: true
      })
    }
    else if(e.scrollTop < 2500 && this.data.isShowTotop === true){
      this.setData({
        isShowTotop: false
      })
    }
  },

  /**
   * 将当前音乐列表存储在缓存
   */
  _setMusicList() {
    wx.setStorageSync('musiclist', this.data.musiclist)
  },

  /**
   * 获取列表头部到顶部的距离
   */
  getNavTop(data){
    console.log('获取列表头部到顶部的距离', data.detail)
    navtop = data.detail
  }
})