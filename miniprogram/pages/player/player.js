// 播放列表
let list = []
// 当前播放歌曲的索引
let curIndex = 0
// 全局背景音频管理对象
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '', // 歌曲专辑图片
    isPlaying: false, // 是否正在播放
    isLyricShow: false, // 是否显示歌词
    lyric: '', // 歌词
    isSame: false // 是否播放同一首歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 读取缓存中的音乐列表
    list = wx.getStorageSync('musiclist')
    curIndex = options.index
    const _musicId = parseInt(options.musicId)
    this.setData({
      isPlaying: app.globalData.isPlaying,
      isSame: _musicId === app.getPlayingMusicId()
    })
    console.log('isSame', this.data.isSame, parseInt(options.musicId), app.getPlayingMusicId())
    this._loadMusicDetail(_musicId)
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
    app.globalData.isPlaying = this.data.isPlaying
    console.log('onUnload', app.globalData.isPlaying)
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
   * 加载音乐详情
   */
  _loadMusicDetail(musicId) {
    if (!this.data.isSame) {
      // 停止当前播放的歌曲
      backgroundAudioManager.stop()
    }
    let music = list[curIndex]
    console.log('加载音乐详情', music)
    // 歌曲名称
    wx.setNavigationBarTitle({
      title: music.name,
    })
    // 歌曲专辑图片
    this.setData({
      picUrl: music.al.picUrl
      // isPlaying: false
    })
    // 设置全局当前正在播放的音乐id
    app.setPlayingMusicId(musicId)
    if(!this.data.isSame){
      wx.showLoading({
        title: '加载中',
      })
    }
    // 歌曲播放url
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then(res => {
      console.log('加载音乐详情', JSON.parse(res.result))
      const result = JSON.parse(res.result)
      if (result.data[0].url === null) {
        wx.showToast({
          title: '当前歌曲无法播放',
          icon: 'none'
        })
        this.setData({
          lyric: '暂无歌词'
        })
        return
      }
      if (!this.data.isSame) {
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = music.al.picUrl
        backgroundAudioManager.singer = music.ar[0].name
        backgroundAudioManager.epname = music.al.name
      }
      // this.setData({
      //   isPlaying: true
      // })

      wx.hideLoading()
      // 获取歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric'
        }
      }).then(res => {
        console.log('获取歌词', musicId, res)
        let lyric = '暂无歌词'
        const result = JSON.parse(res.result)
        if (!result.nolyric) {
          const lrc = result.lrc.lyric
          if (lrc) {
            lyric = lrc
          }
        }
        this.setData({
          lyric
        })
      })
    })
  },

  /**
   * 切换播放状态
   */
  togglePlaying() {
    const isPlaying = this.data.isPlaying
    if (isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !isPlaying
    })
  },

  /**
   * 上一曲
   */
  onPrev() {
    // 如果当前播放的是第一首歌曲，上一曲切换到最后一首
    if (curIndex == 0) {
      curIndex = list.length - 1
    } else {
      curIndex--;
    }
    this.setData({
      isSame: false
    })
    this._loadMusicDetail(list[curIndex].id)
  },

  /**
   * 下一曲
   */
  onNext() {
    // 如果当前播放的是最后一首歌曲，下一曲切换到第一首
    if (curIndex == list.length) {
      curIndex = 0
    } else {
      curIndex++;
    }
    this.setData({
      isSame: false
    })
    this._loadMusicDetail(list[curIndex].id)
  },

  /**
   * 切换是否显示歌词
   */
  onShowLyricChange() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },

  /**
   * 更新当前播放时间(s)
   */
  updateTime(event) {
    // console.log(event)
    // 更新歌词组件的播放时间
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },

  /**
   * 监听背景音乐播放
   */
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },

  /**
   * 监听背景音乐暂停
   */
  onPause() {
    this.setData({
      isPlaying: false
    })
  }
})