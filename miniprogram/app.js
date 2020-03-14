//app.js
App({
  onLaunch: function () {
    this.checkUpdate()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'music-1668',
        traceUser: true,
      })
    }

    this.globalData = {
      // 正在播放的音乐id
      playingMusicId: -1,
      isPlaying: false, // 是否正在播放
      currentTime: '00:00', // 当前播放时间
      movableDis: 0, // 小圆球移动的距离
      progress: 0, // 进度条移动距离
      openid: -1
    }

    this.getOpenId()
  },

  setPlayingMusicId(musicId) {
    this.globalData.playingMusicId = musicId
  },

  getPlayingMusicId() {
    return this.globalData.playingMusicId
  },

  getOpenId() {
    wx.cloud.callFunction({
      name: 'login',
    }).then(res => {
      console.log('openid', res.result.openid)
      const openid = res.result.openid
      this.globalData.openid = openid
      if (wx.getStorageSync(openid) == '') {
        wx.setStorageSync(openid, [])
      }
    })
  },

  /**
   * 检查更新
   */
  checkUpdate() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(() => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用',
            success(res) {
              if (res.confirm) {
                updateManager.applyUpdate()
              }
            }
          })
        })
      }
    })
  }
})