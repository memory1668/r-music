// components/audio-player/audio-player.js
let innerAudioContext = wx.createInnerAudioContext()
let isMoving = false // 进度条是否正在移动
let curSec = -1 // 当前播放秒数
// innerAudioContext.destroy()
// innerAudioContext = wx.createInnerAudioContext()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    audioSrc: {
      type: String,
      value: ''
    }
  },

  lifetimes: {
    ready() {
      // setInterval(() => {
      // this.bindAudioEvent()        
      // }, 1000)
    }
  },

  // observers: {
  //   innerAudioContext: 
  // },

  externalClasses: [
    'iconfont',
    'icon-bofang',
    'icon-zanting'
  ],

  /**
   * 组件的初始数据
   */
  data: {
    isPlaying: false,
    sliderDistance: 0, // 进度条移动距离
    name: 'Jack'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 绑定音频事件
     */
    bindAudioEvent() {
      innerAudioContext.onPlay(() => {
        console.log('onPlay')
        // isMoving = false
        // this.triggerEvent('musicPlay')
      })
      
      innerAudioContext.onStop(() => {
        if (this.data.isPlaying) {
          console.log('onStop', this.data.isPlaying)
          this.setData({
            isPlaying: !this.data.isPlaying
          })
          console.log('onStop', this.data.isPlaying)
        }
      })

      innerAudioContext.onPause(() => {
        console.log('onPause')

        // this.triggerEvent('musicPause')
      })

      innerAudioContext.onWaiting(() => {
        console.log('onWaiting')
      })

      innerAudioContext.onCanplay(() => {
        console.log('onCanplay', innerAudioContext.duration)
        // if (typeof backgroundAudioManager.duration != 'undefined') {
        //   this._setTotalTime()
        // } else {
        //   // 延时一秒再设置音频总时长
        //   timer = setTimeout(() => {
        //     this._setTotalTime()
        //   }, 1000)
        // }
        innerAudioContext.onTimeUpdate(() => {
          console.log('onTimeUpdate', innerAudioContext.currentTime)
          if (!isMoving) {
            const duration = innerAudioContext.duration // 总时长
            const currentTime = innerAudioContext.currentTime // 当前播放时间
            const sec = currentTime.toString().split('.')[0]
            if (sec != curSec) {
              // console.log('onTimeUpdate', currentTime)
              // this._setCurrentTime()
              // this.setData({
              // 圆球的移动距离，减去圆球的距离是防止它移动到进度条外
              // movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              // 进度条移动距离， 总长度为100
              // sliderDistance: 50,
              // })
              this.setData({
                sliderDistance: this.data.sliderDistance + 1
              })
              console.log('sliderDistance', this.data.name, this.data.sliderDistance)
              // app.globalData.movableDis = this.data.movableDis
              // app.globalData.progress = this.data.progress
              // 更新当前播放秒数
              curSec = sec
              // this.triggerEvent('updateTime', {
              //   currentTime
              // })
            }
          }
        })
      })

      innerAudioContext.onEnded(() => {
        console.log('onEnded')
        this.setData({
          isPlaying: false
        })
        // 当前音乐播放结束
        // this.triggerEvent('musicEnd')
      })

      innerAudioContext.onError((res) => {
        console.error('onError', res.errMsg)
        console.error('onError', res.errCode)
        wx.showToast({
          title: '错误' + res.errCode,
        })
      })
    },

    /**
     * 取消监听音频事件
     */
    offAudioEvent() {
      innerAudioContext.offPlay()
      innerAudioContext.offStop()
      innerAudioContext.offPause()
      innerAudioContext.offWaiting()
      innerAudioContext.offCanplay()
      innerAudioContext.offTimeUpdate()
      innerAudioContext.offEnded()
      innerAudioContext.offError()
    },

    /**
     * 播放/暂停
     */
    play() {
      const isPlaying = this.data.isPlaying
      // 播放
      if (!isPlaying) {
        // innerAudioContext.autoplay = true
        // innerAudioContext.onPlay(() => {
        //   console.log('开始播放')
        // })
        // innerAudioContext.onError((res) => {
        //   console.log(res.errMsg)
        //   console.log(res.errCode)
        // })
        // 不是同一个录音
        if (innerAudioContext.src !== this.data.audioSrc) {
          innerAudioContext.src = this.data.audioSrc
          console.log('不是同一个录音', this.data.audioSrc)
          innerAudioContext.stop()
          this.offAudioEvent()
          this.bindAudioEvent()
          // innerAudioContext.destroy()
          // innerAudioContext = wx.createInnerAudioContext()
          setTimeout(() => {
            innerAudioContext.play()
          }, 800)
        } else {
          this.bindAudioEvent()
          innerAudioContext.play()
        }

      }
      // 暂停
      else {
        // innerAudioContext.onPause(() => {
        //   console.log('暂停播放')
        // })
        innerAudioContext.pause()
      }
      this.setData({
        isPlaying: !isPlaying
      })
      console.log('播放/暂停', this.data.isPlaying)
    },

    /**
     * 进度值改变后触发
     */
    onChange(event) {
      wx.showToast({
        icon: 'none',
        title: `当前值：${event.detail}`
      });
    },


    /**
     * 	开始拖动时触发
     */
    dragStart() {
      isMoving = true
      console.log('开始拖动时触发')
    },

    /**
     * 	结束拖动时触发
     */
    dragEnd() {
      isMoving = false
      console.log('结束拖动时触发')
    }
  }
})