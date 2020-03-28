// components/playlist-item/playlist-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlistitem: {
      type: Object,
      value: {
        name: '那些好听却记不起歌名的歌',
        playCount: 179162
      }
    }
  },

  observers: {
    ['playlistitem.playCount'](val) {
      this.setData({
        _count: this._tranCount(val, 0)
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
