// miniprogram/pages/album/album-detail/album-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [], // 专辑的音乐列表
    album: {
      name: '',
      picUrl: '',
      singer: {
        name: '',
        avatar: ''
      },
      publishTime: '' // 发行时间
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAlbumDetail(options.id)
    const musiclist = this.data.musiclist
    console.log('avatar', options)
    this.setData({
      ['album.publishTime']: this.fmtTime(Number(options.publishTime)),
      ['album.singer.avatar']:  getApp().globalData.curSingerAvatar 
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

  getAlbumDetail(id) {
    wx.showLoading()
    wx.cloud.callFunction({
      name: 'album',
      data: {
        id,
        $url: 'detail'
      }
    }).then(res => {
      if (res.result.code !== 200) {
        console.log('获取专辑详情失败', res.errMsg)
        wx.showToast({
          title: '获取专辑详情失败',
          icon: 'none'
        })
        return
      }
      console.log('获取专辑详情成功', res)
      const musiclist = res.result.data
      this.setData({
        musiclist,
        ['album.name']: musiclist[0].al.name,
        ['album.picUrl']: musiclist[0].al.picUrl,
        ['album.singer.name']: musiclist[0].ar[0].name
      })
      wx.hideLoading({})
      wx.stopPullDownRefresh({})
    }).catch(err => {
      console.log('获取专辑详情失败', err)
      wx.showToast({
        title: '获取专辑详情失败',
        icon: 'none'
      })
    })
  },
  /**
   * 格式化时间
   * time 时间戳
   */
  fmtTime(time) {
    const date = new Date(time)
    let formatedTime = ''
    formatedTime = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
    return formatedTime
  }
})