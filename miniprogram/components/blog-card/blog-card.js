// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },

  observers: {
    ['blog.createTime'](val) {
      if (val) {
        this.setData({
          createTime: formatTime(new Date(val))
        })
      }
    }
  },

  externalClasses: [
    'iconfont',
    'icon-bofang',
    'icon-zanting'
  ],

  /**
   * 组件的初始数据
   */
  data: {
    createTime: '' // 发布博客的时间
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onPreviewImage(event) {
      const ds = event.target.dataset
      wx.previewImage({
        urls: ds.imgs,
        current: ds.imgsrc
      })
    },

    /**
     * 跳转到博客详情页
     */
    goComment() {
      const AudioPlayer = this.selectComponent('#audio-player')
      wx.navigateTo({
        url: `/pages/blog-comment/blog-comment?blogId=${this.data.blog._id}`,
        success: ()=>{
          AudioPlayer.stopCurAudio()
        }
      })
    },

  }
})