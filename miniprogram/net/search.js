const BASE_URL = 'http://musicapi.xiecheng.live'
import {
  request
} from './http.js'
module.exports = {
  search(keyword) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${BASE_URL}/search?keywords=${keyword}`,
        success: async(res) => {
          console.log('搜索成功', res.data.result.songs)
          const songs = res.data.result.songs
          let songsFmt = []
          for (let i = 0; i < songs.length; i++) {
            const song = songs[i]
            const album = []
            console.log('album', album)
            // 选择需要的字段返回
            songsFmt.push(
              {
                id: song.id,
                name: song.name, // 歌曲名称
                al: {
                  name: song.album.name
                },
                ar: song.artists.map(item => {
                  return {
                    name: item.name
                  }
                })
              }
            )
          }
          resolve(songsFmt)
        },
        fail: (err) => {
          console.log('搜索失败', err)
          reject(err)
        }
      })
    })

  }
}