// components/lyric/lyric.js
let lyricHeight = 0 // 每行歌词高度
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示歌词
    isLyricShow: {
      type: Boolean,
      value: false
    },
    // 歌词
    lyric: String
  },

  data: {
    lrcList: [],
    scrollTop: 0
  },

  observers: {
    lyric(lrc) {
      if(lrc == '暂无歌词') {
        this.setData({
          lrcList: [
            {
              lrc,
              time: 0
            }
          ],
          curLyricIndex: -1
        })
      }else {
        this._parseLyric(lrc)
      }
      // console.log('歌词', lrc)
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    curLyricIndex: -1 // 当前高亮歌词
  },

  lifetimes: {
    ready() {
      // 不同屏幕rpx换算px（屏幕宽度/750）
      wx.getSystemInfo({
        success: (res) => {
          lyricHeight = res.screenWidth / 750 * 64
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 格式化歌词数据
     */
    _parseLyric(lyric) {
      let line = lyric.split('\n')
      let _lrcList = []
      line.forEach(element => {
        let time = element.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          // split传入数组[a,b]作为参数，相当于以字符串'[a, b]'进行分割
          let lrc = element.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 将时间转换成秒
          let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          // console.log(time2Seconds)
          _lrcList.push({
            lrc,
            time: time2Seconds
          })
        }
      });
      this.setData({
        lrcList: _lrcList
      })
    },

    /**
     * 更新当前播放时间
     */
    update(currentTime) {
      console.log(currentTime)
      const lrcList = [...this.data.lrcList]
      if(lrcList.length == 0) {
        return
      }
      // 若当前播放时间大于最后一句歌词
      if (currentTime > lrcList[lrcList.length - 1].time) {
        this.setData({
          curLyricIndex: -1, // 不高亮任何歌词
          scrollTop: lrcList.length * lyricHeight
        })
      }
      for (let i = 0, len = lrcList.length; i < len; i++) {
        if (currentTime <= lrcList[i].time) {
          console.log('更新当前播放时间', currentTime)
          this.setData({
            curLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    }
  }
})