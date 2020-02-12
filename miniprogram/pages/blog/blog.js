// pages/blog/blog.js
let keyword = '' //搜索关键字 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowModel: false, // 是否显示弹出层
    blogList: [] // 博客列表数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 清空博客列表
    this.data.blogList = []
    this._loadBlogList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
        start,
        $url: 'list',
        count: 10
      }
    }).then(res => {
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
  }
})