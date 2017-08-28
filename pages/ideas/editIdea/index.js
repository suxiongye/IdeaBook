// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      disabled: false,
      recording: false,
      playing: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    initIdeaById(this, this.data.id)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 更新修改信息
   */
  titleChange: function (e) {
    if (!e.detail.value) {
      this.setData({
        titleError: "请输入标题",
        disabled: true
      })
      return
    }
    this.setData({
      ideaTitle: e.detail.value
    })
    if (isNameExist(this.data.oldTitle, this.data.ideaTitle)) {
      this.setData({
        titleError: "(笔记标题已存在)",
        disabled: true
      })
    } else {
      this.setData({
        titleError: "",
        disabled: false
      })
    }
  },
  contentChange: function (e) {
    this.setData({
      ideaContent: e.detail.value
    })
  },
  /**
   * 增加图片
   */
  choosePic: function (e) {
    var page = this
    //存储原来的图片
    var picList = page.data.ideaPicList
    var data = []
    if (picList && picList.length) {
      picList.forEach((item) => {
        data.push(item)
      })
    }
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        if (res.tempFilePaths && res.tempFilePaths.length) {
          res.tempFilePaths.forEach((item) => {
            data.push(item)
          })
        }
        page.setData({
          ideaPicList: data
        })
      },
    })
  },
  /**
   * 根据下标删除图片
   */
  removePic: function (event) {
    var page = this
    wx.showModal({
      title: '删除图片',
      content: '是否移除图片？',
      success: function (res) {
        if (res.confirm) {
          var index = event.currentTarget.dataset.index
          var data = []
          for (var i = 0; i < page.data.ideaPicList.length; i++) {
            if (i != index) {
              data.push(page.data.ideaPicList[i])
            }
          }
          page.setData({
            ideaPicList: data
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 更新idea
   */
  editIdea: function (e) {
    updateIdea(this)
    wx.navigateBack()
  },

  /**
   * 删除idea
   */
  deleteIdea: function (e) {
    wx.showModal({
      title: '删除笔记',
      content: '是否移除笔记？',
      success: function (res) {
        if (res.confirm) {
          deleteIdea(e.currentTarget.dataset.id)
          wx.navigateBack()
        }
      }
    })
  },

  /**
* 解决长按事件往下传递问题
*/
  bindTouchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  bindTouchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  /**
* 预览图片
*/
  previewImage: function (e) {
    if (this.touchEndTime - this.touchStartTime < 350) {
      var current = e.target.dataset.src
      wx.previewImage({
        current: current,
        urls: this.data.ideaPicList
      })
    }
  },
})

/**
 * 根据id获取idea
 */
function initIdeaById(page, id) {
  var ideas = wx.getStorageSync("ideas")
  if (ideas.length) {
    ideas.forEach((item) => {
      if (item.id == id) {
        page.setData({
          id: id,
          ideaTitle: item.ideaTitle,
          ideaContent: item.ideaContent,
          ideaPicList: item.ideaPicList,
          ideaRecordList: item.ideaRecordList,
          themeId: item.themeId,
          oldTitle: item.ideaTitle,
        })
      }
    })
  }
}

/**
 * 存储
 */
function updateIdea(page) {
  var ideas = wx.getStorageSync("ideas")
  var idea = page.data
  var data = []
  ideas.forEach((item) => {
    if (item.id == page.data.id) {
      item = { id: idea.id, ideaTitle: idea.ideaTitle, ideaContent: idea.ideaContent, ideaPicList: idea.ideaPicList, ideaRecordList: idea.ideaRecordList, themeId: idea.themeId }
    }
    data.push(item)
  })
  wx.setStorageSync("ideas", data)
}

/**
 * 删除
 */
function deleteIdea(id) {
  var ideas = wx.getStorageSync("ideas")
  var data = []
  ideas.forEach((item) => {
    if (item.id != id) {
      data.push(item)
    }
  })
  wx.setStorageSync("ideas", data)
}

/**
 * 判断名称是否重复
 */
function isNameExist(oldTitle, newTitle) {
  if (oldTitle == newTitle) return false;
  var tag = false;
  var ideas = wx.getStorageSync("ideas")
  ideas.forEach((item) => {
    if (newTitle == item.ideaTitle) {
      tag = true;
      return tag;
    }
  })
  return tag;
}