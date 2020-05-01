// pages/index/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '音乐',
    curIndex: 0,
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
    ],
    isShowBlog: true,
    isShowHistory: true,
    isShowCollect: true
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
    this.getCollectList()
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
    console.log('页面上拉触底事件的处理函数' + e)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // onPageScroll: function (e) {
  //   // console.log(e.scrollTop)
  // },

  onSwitchTab(e) {
    // console.log(e.detail)
    this.setData({
      currentTab: e.detail.currentTab,
      curIndex: e.detail.curIndex
    })
  },

  onHideBlog() {
    // console.log('onHideBlog')
    this.setData({
      showPopoup: true
    })
  },

  onClose() {
    this.setData({
      showPopoup: false
    });
  },

  /**
   * 自定义功能开关状态改变
   */
  onChange(e) {
    const index = e.currentTarget.dataset.index
    // 需要手动对 checked 状态进行更新
    this.setData({
      [`func[${index}].status`]: e.detail
    });
    // console.log('需要手动对 checked 状态进行更新', detail)
    if (index === 0 && e.detail === false) {
      console.log('hideBlog')
      const tabbar = this.selectComponent('#tabbar')
      tabbar.hideBlog()
      this.setData({
        isShowBlog: false,
        curIndex: 1,
      })
    }

    if (index === 0 && e.detail === true) {
      console.log('showBlog')
      const tabbar = this.selectComponent('#tabbar')
      tabbar.showBlog()
      this.setData({
        isShowBlog: true,
        curIndex: 2,
      })
    }

    if(index === 1){
      this.setData({
        isShowHistory: e.detail
      })
    }
    if (index === 2) {
      this.setData({
        isShowCollect: e.detail
      })
    }
  },

  /**
   * 首页滑动
   */
  swiperChange(e) {
    console.log('轮播图滑动', e)
    const selected = e.detail.current
    this.selectComponent('#tabbar').setSelected(selected)
    this.setData({
      curIndex: e.detail.current
    })
  },

  /**
   * 获取收藏音乐列表
   */
  getCollectList() {
    // 由于collect集合的权限是仅创建者可读写，所以无需根据id查询
    db.collection('collect').get().then(res=>{
      console.log('获取收藏音乐列表成功', res)
      let collectList = res.data // 收藏的音乐列表
      // 保存收藏音乐列表在缓存
      wx.setStorage({
        key: 'collectList',
        data: collectList
      })
    }).catch(err=>{
      console.log('获取收藏音乐列表失败', err)
    })
  }
})