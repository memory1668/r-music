// pages/blog-comment/blog-comment.js
import formatTime from '../../utils/formatTime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blog: {},
    commentList: [],
    blogId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      blogId: options.blogId
    })
    this._getBlogDetail()
    // this.offAudioEvent()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    const blogObj = this.data.blog
    return {
      title: blogObj.content,
      path: `pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
    }
  },

  _getBlogDetail() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        blogId: this.data.blogId,
        $url: 'detail'
      }
    }).then(res => {
      console.log('获取博客详情成功', res);
      let commentList = res.result.commentList.data
      commentList.forEach((item, index) => {
        item.createTime = formatTime(new Date(item.createTime))
      })
      this.setData({
        blog: res.result.detail.data[0],
        commentList: res.result.commentList.data
      })
    }).catch(err => {
      console.log('获取博客详情失败', err);
    }).finally(() => {
      wx.hideLoading()

    })
  }
})