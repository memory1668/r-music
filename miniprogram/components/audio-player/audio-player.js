// components/audio-player/audio-player.js
let innerAudioContext = wx.createInnerAudioContext()
let isMoving = false // 进度条是否正在移动
let curSec = -1 // 当前播放秒数
let duration = 0 // 当前播放音频总时长 单位s
let timer = null // 切换播放音频防抖
let sliderDistance = 0
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
    },
    // 录音总时长单位秒
    duration: {
      type: Number,
      value: 0
    }
  },

  observers: {

  },

  lifetimes: {
    ready() {
      // setInterval(() => {
      // this.bindAudioEvent()        
      // }, 1000)
      this._setCurrentTime()
    },
    detached() {
      console.log('detached ')
      this.stopCurAudio()
    }
  },

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
    name: 'Jack',
    currentTime: '00:00' // 当前播放时间
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
        console.log('onPlay', innerAudioContext.src)
        // isMoving = false
        // this.triggerEvent('musicPlay')
      })

      innerAudioContext.onStop(() => {
        // console.log('onStop', this.data.isPlaying)
        // if (this.data.isPlaying) {

        // }
        console.log('onStop', this.data.isPlaying)
        this.setData({
          isPlaying: false
        })
        this.offAudioEvent()
        console.log('onStop', this.data.isPlaying)
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
            console.log('sec', sec, curSec)
            if (sec != curSec) {
              // console.log('onTimeUpdate', currentTime)
              // this._setCurrentTime()
              // this.setData({
              // 圆球的移动距离，减去圆球的距离是防止它移动到进度条外
              // movableDis: (movableAreaWidth - movableViewWidth) * currentTime / duration,
              // 进度条移动距离， 总长度为100
              // sliderDistance: 50,
              // })
              this._setCurrentTime()
              this.setData({
                sliderDistance: 100 * currentTime / this.data.duration
              })
              console.log('sliderDistance', this.data.sliderDistance)
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
        this.setData({
          sliderDistance: 100
        })
        console.log('onEnded')
        setTimeout(() => {
          this.setData({
            isPlaying: false,
            sliderDistance: 0
          })
        }, 500)
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

      innerAudioContext.onSeeking(() => {
        console.log('onSeeking')
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
      innerAudioContext.offSeeking()
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
          // clearTimeout(timer)
          // setTimeout(()=>{
          console.log('不是同一个录音');
          innerAudioContext.src = this.data.audioSrc
          !innerAudioContext.paused && innerAudioContext.stop()
          console.log('不是同一个录音');
          // 延时, 音频停止后再移除绑定事件
          setTimeout(() => {
            this.offAudioEvent()
            this.bindAudioEvent()
          }, 300)
          // innerAudioContext.destroy()
          // innerAudioContext = wx.createInnerAudioContext()
          // 延时，避免播放上一条录音
          setTimeout(() => {
            const sliderDistance = this.data.sliderDistance
            if (sliderDistance > 0){
              const currentTime = this.data.duration * sliderDistance / 100
              console.log('seek', currentTime, sliderDistance)
              innerAudioContext.seek(currentTime)
            }
            innerAudioContext.play()
          }, 800)
          // }, 300)
        } else {
          // this.bindAudioEvent()
          const sliderDistance = this.data.sliderDistance
          if (sliderDistance > 0) {
            const currentTime = this.data.duration * sliderDistance / 100
            console.log('seek', currentTime, sliderDistance)
            innerAudioContext.seek(currentTime)
          }
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
      // sliderDistance = event.detail
      this.setData({
        sliderDistance: event.detail
      })
      console.log('进度值改变后触发', this.data.sliderDistance)
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
      // 不是同一首歌
      isMoving = false
      console.log('结束拖动时触发')
      if (innerAudioContext.src !== this.data.audioSrc){
        return
      }
      const currentTime = this.data.duration * this.data.sliderDistance / 100
      // const currentTimeFmt = this._formatTime(currentTime)
      console.log('圆球触摸拖拽结束')
      innerAudioContext.seek(currentTime)
      curSec = currentTime.toString().split('.')[0]
      this._setCurrentTime()
    },

    /**
     * 停止当前播放的歌曲
     */
    stopCurAudio() {
      // innerAudioContext.stop();
      // if (this.data.sliderDistance > 0) {
      //   this.setData({
      //     sliderDistance: 0
      //   })
      // }
      if (!innerAudioContext.paused) {
        console.log('stopCurAudio')
        innerAudioContext.stop();
      }
      setTimeout(() => {
        if (innerAudioContext.src !== '') {
          innerAudioContext.src = 'null'
        }
      }, 300)
    },

    /**
     * 设置音频当前播放时间
     */
    _setCurrentTime() {
      const currentTimeFmt = this._formatTime(innerAudioContext.currentTime)
      this.setData({
        currentTime: `${currentTimeFmt.min}:${currentTimeFmt.sec}`
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
  }
})