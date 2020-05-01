const list1 = [{
    "pagePath": "/pages/playlist/playlist",
    "text": "音乐",
    "iconPath": "/images/music.png",
    "selectedIconPath": "/images/music-actived.png"
  },
  {
    "pagePath": "/pages/blog/blog",
    "text": "发现",
    "iconPath": "/images/blog.png",
    "selectedIconPath": "/images/blog-actived.png"
  },
  {
    "pagePath": "/pages/profile/profile",
    "text": "我的",
    "iconPath": "/images/profile.png",
    "selectedIconPath": "/images/profile-actived.png"
  }
]
const list2 = [{
    "pagePath": "/pages/playlist/playlist",
    "text": "音乐",
    "iconPath": "/images/music.png",
    "selectedIconPath": "/images/music-actived.png"
  },
  {
    "pagePath": "/pages/profile/profile",
    "text": "我的",
    "iconPath": "/images/profile.png",
    "selectedIconPath": "/images/profile-actived.png"
  }
]
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#FFBE5A",
    list: list1
  },

  attached() {},
  pageLifetimes: {
    show: function() {
      console.log('show')
      // const isShowBlog = getApp().globalData.isShowBlog
      // if (isShowBlog) {
      //   this.setData({
      //     list: list1
      //   })
      // }else {
      //   this.setData({
      //     list: list2
      //   })
      // }
    }
  },

  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      this.setData({
        selected: data.index
      })
      this.triggerEvent('switchTab', {
        currentTab: data.name,
        curIndex: data.index
      })
    },

    hideBlog() {
      this.setData({
        list: list2
      })
      this.setData({
        selected: 1
      })
    },

    showBlog() {
      this.setData({
        list: list1
      })
      this.setData({
        selected: 2
      })
    },

    /**
     * 设置当前选中的tab索引
     */
    setSelected(selected) {
      this.setData({
        selected
      })
    }
  }
})