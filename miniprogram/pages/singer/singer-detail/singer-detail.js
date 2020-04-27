// miniprogram/pages/singer/singer-detail/singer-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singer: {},
    active: 0,
    musiclist: [],
    albumList: [],
    tabs: ['热门歌曲', '热门专辑'],
    curTab: 0,
    winHeight: 0,
    navtop: 0,
    isShowSticky: false,
    singerId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getSingerInfo(options.index)
    this.setData({
      singerId: options.singerId
    })
    this.getHotSong()
    this.getAlbum()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getNavTop()
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
  onReachBottom: function () {},

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
        id: this.data.singerId,
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
  },

  /**
   * 获取歌手热门专辑
   */
  getAlbum() {
    wx.showLoading({
      title: '加载中'
    })
    wx.cloud.callFunction({
      name: 'singer',
      data: {
        id: this.data.singerId,
        $url: 'getAlbum'
      }
    }).then(res => {
      console.log('获取歌手热门专辑成功', res)
      if (res.result.code !== 200) {
        console.log('获取歌手热门专辑失败', res)
        wx.showToast({
          title: '获取歌手热门专辑失败',
          icon: 'none'
        })
        return
      }
      const albumList = res.result.data
      this.setData({
        albumList
      })
      wx.hideLoading({})
      wx.stopPullDownRefresh({})
    }).catch(err => {
      console.log('获取歌手热门专辑失败', err)
      wx.showToast({
        title: '获取歌手热门专辑失败',
        icon: 'none'
      })
    })
  },
  /**
   * 切换标签导航
   */
  changeTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      curTab: index
    })
  },
  /**
   * 获取导航标签到顶部的距离
   */
  getNavTop() {
    wx.createSelectorQuery().select('#tab').boundingClientRect((rect) => {
      this.setData({
        navtop: rect.top
      })
    }).exec()
  },

  /**
   * 列表滚动
   */
  scroll(e) {
    // console.log(e.detail.scrollTop)
    if (e.detail.scrollTop > this.data.navtop && !this.data.isShowSticky) {
      this.setData({
        isShowSticky: true
      })
    } else if (e.detail.scrollTop <= this.data.navtop && this.data.isShowSticky) {
      this.setData({
        isShowSticky: false
      })
    }
  }
})