// pages/playlist/playlist.js
const MAX_LIMIT = 15 //每次获取15条歌单
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  options: {
    styleIsolation: 'shared',
  },
  /**
   * 组件的初始数据
   */
  data: {
    swipers: {
      imageUrl: '',
      music: []
    },
    playlist: []
  },

  attached() {
    this._getPlayList()
    this._getSwiper()
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    },

    /**
     * 获取轮播图
     */
    _getSwiper() {
      // 获取最新的6张轮播图
      db.collection('swiper-show')
        .skip(0)
        .limit(6)
        .orderBy('createTime', 'desc')
        .get().then(res => {
          this.setData({
            swipers: res.data
          })
          this._setMusicList()
          console.log('获取轮播图成功', res)
        }).catch(err => {
          console.log('获取轮播图失败', err)
        })
    },

    /**
     * 将当前音乐列表存储在缓存
     */
    _setMusicList() {
      const musicList = []
      this.data.swipers.forEach(item => {
        musicList.push(item.music)
      })
      wx.setStorageSync('musiclist', musicList)
    },

    /**
     * 选中音乐列表项
     */
    onSelect(event) {
      // console.log('select', event)
      const ds = event.currentTarget.dataset
      this._setMusicList()
      // 跳转到音乐播放页面
      wx.navigateTo({
        url: `/pages/player/player?musicId=${ds.musicid}&index=${ds.index}`,
      })
    },

    /**
     * 跳转排行榜
     */
    goCharts() {
      wx.navigateTo({
        url: '/pages/charts/charts'
      })
    },

    /**
     * 跳转到搜索页
     */
    goSearch() {
      wx.navigateTo({
        url: '/pages/search/search'
      })
    },

    /**
     * 跳转播放历史页
     */
    goHistory() {
      wx.navigateTo({
        url: '/pages/profile-history/profile-history'
      })
    },

    // 滚动到底部
    scrollToBottom() {
      this._getPlayList()
    }
  }
})