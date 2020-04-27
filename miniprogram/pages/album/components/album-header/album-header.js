// components/detail/album-header/album-header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    album: Object,
    // 歌手id, -1表示不能跳转到歌手详情
    singerId: {
      type: Number,
      value: -1
    }
  },
  observers: {
    album(val){
      this.setData({
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
    albumItem: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goSinger() {
      if(this.data.singerId === -1){
        wx.navigateBack()
      }else{
        wx.navigateTo({
          url: `/pages/singer/singer-detail/singer-detail?singerId=${this.data.singerId}`,
        })
      }
    }
  }
})
