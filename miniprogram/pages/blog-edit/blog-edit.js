// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140 // 最大输入字数
const MAX_IMG_NUM = 9 // 最大图片上传数量
const db = wx.cloud.database()
let userInfo = {} // 用户昵称头像
let content = '' // 博客内容
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0, // 输入字数
    fotterBottom: 0, // 底部栏距离底部的距离
    images: [], // 已经选择的图片
    isShowSelect: true // 是否显示选择图片图标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    userInfo = {
      ...options
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 监听文本框输入事件
   */
  onInput(event) {
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },

  onFocus(event) {
    this.setData({
      fotterBottom: event.detail.height // 键盘高度
    })
  },

  onBlur() {
    this.setData({
      fotterBottom: 0
    })
  },

  /**
   * 选择要上传的图片
   */
  onChooseImage() {
    // 还能上传的图片数量
    let max = MAX_IMG_NUM - this.data.images.length
    console.log('还能上传的图片数量', max)
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          isShowSelect: max <= 0 ? false : true
        })
      },
    })
  },

  /**
   * 删除图片
   */
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length === MAX_IMG_NUM - 1) {
      this.setData({
        isShowSelect: true
      })
    }
  },

  /**
   * 预览图片
   */
  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc
    })
  },

  /**
   * 发布
   */
  send() {
    if (content.trim() == '') {
      wx.showToast({
        title: '发布内容不能为空',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '发布中',
    })
    this._uploadImages().then(res => {
      console.log(' 所有 File Id', res[res.length-1])
      // 所有 File Id
      const img = res[res.length - 1]
      this._post(img).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
          icon: 'none'
        })
        wx.navigateBack()
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '发布失败, 请重试',
          icon: 'none'
        })
        console.log(err)
      })
    }).catch(err => {
      wx.hideLoading()
      console.log(err)
    })
  },

  /**
   * 上传图片
   */
  _uploadImages() {
    const images = [...this.data.images]
    const promiseArr = []
    let fileIds = []
    // 上传图片
    for (let i = 0, len = images.length; i < len; i++) {
      const pm = new Promise((resolve, reject) => {
        let item = images[i]
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + Math.random() * 1000000 + suffix,
          filePath: item,
          success: res => {
            console.log('上传图片成功', res)
            fileIds = fileIds.concat(res.fileID)
            resolve(fileIds)
          },
          fail: err => {
            console.log('上传图片失败', err)
            reject()
          }
        })
      })
      promiseArr.push(pm)
    }
    return Promise.all(promiseArr)
  },

  /**
   * 保存博客数据在数据库
   */
  _post(img) {
    return db.collection('blog').add({
      data: {
        ...userInfo,
        content,
        img,
        createTime: db.serverDate() // 服务端时间
      }
    })
  }
})