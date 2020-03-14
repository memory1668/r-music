// 播放列表
let list = []
let collectList = [] // 收藏列表
// 当前播放歌曲的索引
let curIndex = 0
// 全局背景音频管理对象
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
const db = wx.cloud.database()
let musicId = -1 // 当前播放的音乐id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '', // 歌曲专辑图片
    isPlaying: false, // 是否正在播放
    isLyricShow: false, // 是否显示歌词
    lyric: '', // 歌词
    isSame: false, // 是否播放同一首歌曲
    isCollected: false,
    count: 0, // 控制循环模式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // 读取缓存中的音乐列表
    list = wx.getStorageSync('musiclist')
    // 读取缓存中的收藏列表
    collectList = wx.getStorageSync('collectList')
    curIndex = options.index
    // const _musicId = parseInt(options.musicId)
    musicId = parseInt(options.musicId)
    this.setData({
      isPlaying: app.globalData.isPlaying,
      isSame: musicId === app.getPlayingMusicId(),
    })
    console.log('isSame', this.data.isSame, parseInt(options.musicId), app.getPlayingMusicId())
    this._loadMusicDetail(musicId)
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
    app.globalData.isPlaying = this.data.isPlaying
    console.log('onUnload', app.globalData.isPlaying)
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
   * 加载音乐详情
   */
  async _loadMusicDetail(musicId) {
    // 和正在播放的是同一首歌
    if (!this.data.isSame) {
      // 停止当前播放的歌曲
      backgroundAudioManager.stop()
    }

    let music = list[curIndex]// 当前正在播放的歌曲
    // 设置全局当前正在播放的音乐id
    app.setPlayingMusicId(musicId)

    // console.log('加载音乐详情', music)
    // 顶部导航栏设置为歌曲名称
    wx.setNavigationBarTitle({
      title: music.name,
    })

    if (!this.data.isSame) {
      wx.showLoading({
        title: '加载中',
      })
    }
    // 获取歌曲专辑图片
    const picUrl = await wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'detail'
      }
    }).then(res => {
      console.log('歌曲专辑图片', res)
      return res.result.picUrl
    }).catch(err => {
      console.log('歌曲专辑图片失败', err)
    })
    
    this.setData({
      picUrl,
      // isPlaying: false
      isCollected: collectList.some(item=>{
        return item.id === musicId
      })// 是否收藏
    })


    // 获取歌曲播放url
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
        let singer = music.ar[0].name
        if (music.ar.length > 1) {
          music.ar.forEach((item, index) => {
            if (index !== 0)
              singer = singer + '/' + item.name
          })
        }
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name
        backgroundAudioManager.coverImgUrl = picUrl
        backgroundAudioManager.singer = singer
        backgroundAudioManager.epname = music.al.name

        this.savePlayHistory()
      }
      // this.setData({
      //   isPlaying: true
      // })

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
      }).catch(err => {
        throw err
      })
    }).catch(err => {
      console.log('加载音乐详情失败', err)
      wx.showToast({
        title: '加载音乐详情失败',
        icon: 'none'
      })
    }).finally(() => {
      wx.hideLoading()
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
    if (curIndex == list.length - 1) {
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
  },

  /**
   * 保存播放记录
   */
  savePlayHistory() {
    // 正在播放的歌曲
    const music = list[curIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let bHave = false
    console.log('保存播放记录', history)
    history.forEach(item => {
      if (item.id == music.id) {
        bHave = true
        return
      }
    })
    if (!bHave) {
      history.unshift(music)
      wx.setStorage({
        data: history,
        key: openid,
      })
    }
  },

  onCollect() {
    let collectList = []
    if (this.data.isCollected) {
      db.collection('collect').where({
          id: musicId
      }).remove().then(res => {
        console.log('取消收藏成功', res)
        if(res.stats.removed > 0){
          this.setData({
            isCollected: false
          })
          // 更新缓存收藏列表
          collectList = wx.getStorageSync('collectList')
          const index = collectList.findIndex(item=>{
            return item.id === musicId
          })
          collectList.splice(index, 1)
          wx.setStorage({
            key: 'collectList',
            data: collectList
          })
        }
        else {
          throw '取消收藏失败' + res.errMsg
        }
      }).catch(err => {
        console.log('取消收藏失败', err)
        wx.showToast({
          title: '操作失败,请重试',
          icon: 'none'
        })
      })
    } else {
      db.collection('collect').add({
        data: {
          ...list[curIndex], // 歌曲信息
          createTime: db.serverDate() // 服务端时间
        }
      }).then(res => {
        console.log('收藏成功')
        this.setData({
          isCollected: true
        })
        // 更新缓存收藏列表
        collectList = wx.getStorageSync('collectList')
        collectList.unshift(list[curIndex]) // 将收藏的歌曲添加到列表头部
        wx.setStorage({
          key: 'collectList',
          data: collectList
        })
      }).catch(err => {
        console.log('收藏失败', err)
        wx.showToast({
          title: '操作失败,请重试',
          icon: 'none'
        })
      })
    }
  },

  changeMode() {
    this.setData({
      count: this.data.count + 1,
    })
  }
})