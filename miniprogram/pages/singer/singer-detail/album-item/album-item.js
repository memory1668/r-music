// pages/singer/singer-detail/album-item/album-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    album: Object
  },

  observers: {
    album(val) {
      console.log('pubTimeFmt', val)
      this.setData({
        pubTimeFmt: this.fmtTime(val.publishTime),
        albumItem: {
          picUrl: val.picUrl
        }
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    pubTimeFmt: '', // 格式化发行日期
    albumItem: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 格式化时间
     * time 时间戳
     */
    fmtTime(time) {
      const date = new Date(time)
      let formatedTime = ''
      formatedTime = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
      return formatedTime
    },

    goAlbumDetail() {
      const album = this.data.album
      getApp().globalData.curSingerAvatar = album.artist.picUrl
      wx.navigateTo({
        url: `/pages/album/album-detail/album-detail?id=${album.id}&publishTime=${album.publishTime}&source=singer`
      })
    }
  }
})