const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array,
    coverImgUrl: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    },
    playCount: {
      type: String,
      value: ''
    },

    isShowSticky: {
      type: Boolean,
      value: false
    },

    isShowTotop: {
      type: Boolean,
      value: false
    },

    listType: {
      type: String,
      value: 'playList'
    }
  },

  observers: {
    musiclist(val) {
      // console.log('observers', val)
      this._setMusicList(val)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1, // 当前选中的音乐id
    navtop: 0
  },

  lifetimes: {
    ready() {
      if (this.data.listType !== 'searchList') {
        this.createSelectorQuery().select('#list-header').boundingClientRect(res => {
          console.log('节点的上边界坐标', res.top)
          this.triggerEvent('getNavTop', res.top)
          this.setData({
            navtop: res.top
          })
        }).exec()
      }
    }
  },

  pageLifetimes: {
    show() {
      // 获取全局当前播放音乐Id
      this.setData({
        playingId: parseInt(app.getPlayingMusicId())
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选中音乐列表项
     */
    onSelect(event) {
      // console.log('select', event)
      const ds = event.currentTarget.dataset
      // 当前选中的音乐id
      const musicid = ds.musicid
      this.setData({
        playingId: musicid
      })
      // 跳转到音乐播放页面
      wx.navigateTo({
        url: `/pages/player/player?musicId=${musicid}&index=${ds.index}`,
      })
    },

    playAll() {
      this.createSelectorQuery().select('#list-header').boundingClientRect(function (rect) {
        console.log('节点的上边界坐标', rect)
      }).exec()
    },

    scrollToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },

    /**
     * 将当前音乐列表存储在缓存
     */
    _setMusicList(musiclist) {
      if (musiclist.length === 0) return
      console.log('将当前音乐列表存储在缓存', this.data.musiclist)
      wx.setStorageSync('musiclist', musiclist)
    }
  }
})