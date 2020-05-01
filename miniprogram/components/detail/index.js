Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array,
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
    },
    coverImgUrl: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navtop: 0
  },

  lifetimes: {
    // ready() {
    //   if (this.data.listType !== 'searchList') {
    //     this.createSelectorQuery().select('#list-header').boundingClientRect(res => {
    //       console.log('节点的上边界坐标', res.top)
    //       this.triggerEvent('getNavTop', res.top)
    //       this.setData({
    //         navtop: res.top
    //       })
    //     }).exec()
    //   }
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    playAll() {
      // this.createSelectorQuery().select('#list-header').boundingClientRect(function (rect) {
      //   console.log('节点的上边界坐标', rect)
      // }).exec()
    },

    scrollToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  }
})