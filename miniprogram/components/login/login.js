// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowModel: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo(event) {
      const userInfo = event.detail.userInfo
      // 允许授权
      if(userInfo) {
        // 关闭弹层
        this.setData({
          isShowModel: false
        })
        this.triggerEvent('loginsuccess', userInfo)
      }else {
        this.triggerEvent('loginfail')
      }
    }
  }
})
