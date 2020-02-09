// components/bottom-modal/bottom-modal.js
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

  options: {
    styleIsolation: 'apply-shared',
    multipleSlots: true
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
    /**
     * 关闭弹出层
     */
    onClose() {
      this.setData({
        isShowModel: false
      })
    }
  }
})