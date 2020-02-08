const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1 // 当前选中的音乐id
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
    }
  }
})