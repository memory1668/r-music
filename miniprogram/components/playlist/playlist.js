/*
 * @Author: your name
 * @Date: 2019-11-01 08:46:52
 * @LastEditTime: 2019-11-08 09:10:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ruankj-bloge:\miniprogram\music\miniprogram\components\playlist\playlist.js
 */
// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlistitem: {
      type: Object
    }
  },

  observers: {
    ['playlistitem.playCount'](val) {
      this.setData({
        _count: this._tranCount(val, 2)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _count: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * @description: 跳转到歌曲列表
     */
    goToMusicList() {
      wx.navigateTo({
        url: `/pages/musiclist/musiclist?playlistId=${this.data.playlistitem.id}`,
      })
    },

    
    /**
     * @description: 转换播放数量
     * @param count 转换前的播放数量 
     * @param point 保留几位小数 
     * @return: 转换后的播放量字符串
     */
    _tranCount(count, point) {
      let countStr = count.toString().split('.')[0]
      if (countStr.length < 6){
        return countStr
      }else if(countStr.length >= 6 && countStr.length <= 8){
        let decimal = countStr.substring(countStr.length - 4, countStr.length - 4 + point)
        return parseFloat(parseInt(count/10000) + '.' + decimal) + '万'
      }else{
        let decimal = countStr.substring(countStr.length - 8, countStr.length - 8 + point)
        return parseFloat(parseInt(count/100000000) + '.' + decimal) + '亿'
      }
    }
  }
})