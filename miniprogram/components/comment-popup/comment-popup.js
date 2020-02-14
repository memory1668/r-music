// components/comment-popup/comment-popup.js
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowModel: {
      type: Boolean,
      value: false
    },
    userInfo: Object,
    blogId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      this.setData({
        content: event.detail.value
      })
      // console.log(event.detail.value);
    },

    /**
     * 发布评论
     */
    onSend() {
      // 插入数据库
      let content = this.data.content
      if (content.trim() === '') {
        wx.showToast({
          title: '评论内容不能为空',
          icon: 'none'
        })
        return
      }
      wx.showLoading({
        title: '发送中',
        mask: true,
      })
      console.log('properties', this.properties);

      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: this.properties.userInfo.nickName,
          avatarUrl: this.properties.userInfo.avatarUrl,
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
          icon: 'none',
        })
        this.setData({
          isShowModel: false,
          content: ''
        })
        this.triggerEvent('refreshCommentList')
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '评论失败，请重试',
          icon: 'none',
        })
        console.log('评论失败', err);
      })
    }
  }
})