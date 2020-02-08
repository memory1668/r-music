let movableAreaWidth = 0
let movableViewWidth = 0
let curSec = -1 // 当前播放秒数
let duration = 0 // 当前播放音频总时长 单位s
let isMoving = false // 进度条是否正在移动
// 全局背景音频管理对象
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: {
      type: Boolean,
      value: false
    }
  },

  lifetimes: {
    ready() {
      console.log('progress-bar ready')
      // 播放的是同一首
      if (this.properties.isSame && this.data.showTime.totalTime === '00:00') {
        this._setTotalTime()
        this._setCurrentTime()
      }
      this._getMovableDis()
      this._bindBGMEvent()
    },

    detached() {
      // console.log('progress-bar detached')
      // 保存当前播放时长
      // app.globalData.currentTime = this.data.showTime.currentTime
    }
  },

  pageLifetimes: {
    show() {
      console.log('progress-bar pageshow')
      if (this.properties.isSame && this.data.showTime.totalTime === '00:00') {
        // 恢复进度条的位置
        this.setData({
          movableDis: app.globalData.movableDis,
          progress: app.globalData.progress
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00', // 当前播放的时间
      totalTime: '00:00' // 歌曲总时长
    },
    movableDis: 0, // 小圆球移动的距离
    progress: 0 // 进度条移动距离
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 获取可移动区域的宽度
     */
    _getMovableDis() {
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
        console.log('获取可移动区域的宽度', movableAreaWidth, movableViewWidth)
      })
    },

    /**
     * 给全局背景音频管理对象绑定事件
     */
    _bindBGMEvent() {
      backgroundAudioManager.onPlay(() => {
        console.log('onPlay')
        isMoving = false
        this.triggerEvent('musicPlay')
      })
      backgroundAudioManager.onStop(() => {
        console.log('onStop')
      })
      backgroundAudioManager.onPause(() => {
        console.log('onPause')
        this.triggerEvent('musicPause')
      })
      backgroundAudioManager.onWaiting(() => {
        console.log('onWaiting')
      })
      backgroundAudioManager.onCanplay(() => {
        console.log('onCanplay', backgroundAudioManager.duration)
        if (typeof backgroundAudioManager.duration != 'undefined') {
          this._setTotalTime()
        } else {
          // 延时一秒再设置音频总时长
          setTimeout(() => {
            this._setTotalTime()
          }, 1000)
        }
      })
      backgroundAudioManager.onTimeUpdate(() => {
        if (!isMoving) {
          const duration = backgroundAudioManager.duration // 总时长
          const currentTime = backgroundAudioManager.currentTime // 当前播放时间
          const sec = currentTime.toString().split('.')[0]
          if (sec != curSec) {
            // console.log('onTimeUpdate', currentTime)
            this._setCurrentTime()
            this.setData({
              // 圆球的移动距离，减去圆球的距离是防止它移动到进度条外
              movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              // 进度条移动距离， 总长度为100
              progress: currentTime / duration * 100,
            })
            app.globalData.movableDis = this.data.movableDis
            app.globalData.progress = this.data.progress
            // 更新当前播放秒数
            curSec = sec
            this.triggerEvent('updateTime', {
              currentTime
            })
          }
        }
      })
      backgroundAudioManager.onEnded(() => {
        console.log('onEnded')
        // 当前音乐播放结束
        this.triggerEvent('musicEnd')
      })
      backgroundAudioManager.onError((res) => {
        console.error('onError', res.errMsg)
        console.error('onError', res.errCode)
        wx.showToast({
          title: '错误' + res.errCode,
        })

      })
    },

    /**
     * 设置音频总时长
     */
    _setTotalTime() {
      duration = backgroundAudioManager.duration
      // console.log('获取音频总时长', duration)
      const durationFmt = this._formatTime(duration)
      this.setData({
        ['showTime.totalTime']: `${durationFmt.min}:${durationFmt.sec}`
      })
    },

    /**
     * 设置音频当前播放时间
     */
    _setCurrentTime() {
      const currentTimeFmt = this._formatTime(backgroundAudioManager.currentTime)
      this.setData({
        ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
      })
    },

    /**
     * 格式化时间
     */
    _formatTime(time) {
      // 分
      let min = Math.floor(time / 60)
      // 秒
      let sec = Math.floor(time % 60)
      return {
        min: min < 10 ? '0' + min : min,
        sec: sec < 10 ? '0' + sec : sec
      }
    },

    /**
     * 圆球位置发生改变
     */
    onChange(event) {
      // console.log('圆球位置发生改变', event)
      const dt = event.detail
      if (dt.source == 'touch') {
        this.data.progress = dt.x / (movableAreaWidth - movableViewWidth) * 100
        this.data.movableDis = dt.x
        isMoving = true
      }
    },

    /**
     * 圆球触摸拖拽结束
     */
    onTouchEnd() {
      const currentTime = duration * this.data.progress / 100
      const currentTimeFmt = this._formatTime(currentTime)
      console.log('圆球触摸拖拽结束')
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
        ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
      })
      backgroundAudioManager.seek(currentTime)
      curSec = currentTime.toString().split('.')[0]
    }
  }
})