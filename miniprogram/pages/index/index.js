// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '音乐',
    showPopoup: false,
    func: [{
        name: '发现模块',
        status: true
      },
      {
        name: '最近播放模块',
        status: true
      },
      {
        name: '我的收藏模块',
        status: true
      },
      {
        name: '生成小程序码模块',
        status: true
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },

  onSwitchTab(e) {
    // console.log(e.detail)
    this.setData({
      currentTab: e.detail.currentTab
    })
  },

  onHideBlog() {
    // console.log('onHideBlog')
    // const tabbar = this.selectComponent('#tabbar')
    // tabbar.hideBlog()
    this.setData({
      showPopoup: true
    })
  },

  onClose() {
    this.setData({
      showPopoup: false
    });
  },

  onChange(e) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      [`func[${e.currentTarget.dataset.index}].status`]: e.detail
    });
    // console.log('需要手动对 checked 状态进行更新', detail)
  }
})