// components/page-profile/page-profile.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  options: {
    styleIsolation: 'shared',
  },

  // externalClasses: [
  //   'my-class'
  // ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 生成小程序二维码
     */
    onTapQrCode() {
      wx.showLoading({
        title: '生成中',
      })
      wx.cloud.callFunction({
        name: 'getQrCode',
      }).then(res => {
        const fileId = res.result
        wx.previewImage({
          urls: [fileId],
          current: fileId
        })
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        wx.hideLoading()
      })
    },

    onHideBlog() {
      this.triggerEvent('hideBlog')
    }
  }
})