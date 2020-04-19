// components/detail/album-header/album-header.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    album: Object,
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

  }
})
