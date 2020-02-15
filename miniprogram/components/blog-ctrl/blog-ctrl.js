// components/blog-ctrl/blog-ctrl.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object,
    blogId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowLogin: false,
    isShowComment: false,
    userInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                // userInfo = res.userInfo
                this.setData({
                  isShowComment: true,
                  userInfo: res.userInfo
                })
                // console.log('userInfo', res.userInfo);
                
              }
            })
          } else {
            this.setData({
              isShowLogin: true
            })
          }
        },
      })
    },

    /**
     * 授权成功
     */
    onLoginSuccess(event) {
      this.setData({
        isShowLogin: false,
        userInfo: event.detail.userInfo
      }, () => {
        this.setData({
          isShowComment: true
        })
      })
    },

    /**
     * 授权失败
     */
    onLoginFail() {
      wx.showModal({
        title: '授权用户才能评论',
        content: ''
      })
    },

    refreshCommentList() {
      this.triggerEvent('refreshCommentList')
    }
  }
})