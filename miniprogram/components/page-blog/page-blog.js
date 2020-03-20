// components/page-blog/page-blog.js
let keyword = '' //搜索关键字 
const MAX_LIMIT = 15 //每次获取15条动态
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  options: {
    styleIsolation: 'shared',
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShowModel: false, // 是否显示弹出层
    blogList: [] // 博客列表数据
  },

  attached() {
    this._loadBlogList()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(event) {
      if (event.from == 'button') {
        const blogObj = event.target.dataset.blog
        console.log(event);
        return {
          title: blogObj.content,
          path: `pages/blog-comment/blog-comment?blogId=${blogObj._id}`
        }
      }
    },

    /**
     * 点击发布
     */
    onPublish() {
      // 判断用户是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                console.log(res)
                this.onLoginSuccess({
                  detail: res.userInfo
                })
              }
            })
          } else {
            // 弹出授权按钮
            this.setData({
              isShowModel: true
            })
          }
        },
      })
    },

    /**
     * 登录成功
     */
    onLoginSuccess(event) {
      console.log('登录成功', event)
      const detail = event.detail
      wx.navigateTo({
        url: `/pages/blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
      })
    },

    /**
     * 登录失败
     */
    onLoginFail() {
      wx.showModal({
        title: '需要授权才能发布',
      })
    },

    /**
     * 加载博客列表数据
     */
    _loadBlogList(start = 0) {
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'blog',
        data: {
          keyword,
          start: this.data.blogList.length,
          count: MAX_LIMIT,
          $url: 'list'
        }
      }).then(res => {
        console.log('加载博客列表数据成功', res);
        this.setData({
          blogList: this.data.blogList.concat(res.result)
        })
        wx.hideLoading()
        wx.stopPullDownRefresh()
      })
    },

    /**
     * 跳转到博客详情页
     */
    goComment(event) {
      wx.navigateTo({
        url: '/pages/blog-comment/blog-comment?blogId=' + event.target.dataset.blogid,
      })
    },

    /**
     * 搜索博客
     */
    onSearch(event) {
      keyword = event.detail.keyword
      // console.log(keyword);
      this.data.blogList = []
      this._loadBlogList()
    },

    /**
     * 滚动到底部
     */
    scrollToBottom() {
      this._loadBlogList()
    }
  }
})