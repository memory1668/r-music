// components/detail/musiclist/musiclist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示头部
    isShowHeader: {
      type: Boolean,
      value: true
    },
    musiclist: Array,
    listType: {
      type: String,
      value: 'playList'
    },
    // 头部是否需要吸附
    isSticky: {
      type: Boolean,
      value: true
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