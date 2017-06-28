// pages/ideas/addIdea/index.js
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
      themeId: options.id
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

  titleChange: function (event) {
    this.setData({
      ideaTitle: event.detail.value
    })
  },
  contentChange: function (event) {
    this.setData({
      ideaContent: event.detail.value
    })
  },
  choosePic: function (e) {
    var page = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        page.setData({
          ideaPicList: res.tempFilePaths
        })
        console.log(res.tempFilePaths)
      },
    })
  },
  addIdea: function(){
    this.setData({
      id: Date.now()
    })
    setIdea(this)
    wx.navigateBack()
  }
})

/**
 * 存储
 */
function setIdea(page){
  var ideas = wx.getStorageSync("ideas")
  var data = []
  if(ideas.length){
    ideas.forEach((item)=>{
      data.push(item)
    })
  }
  console.log(page.data.id)
  data.push(page.data)
  wx.setStorageSync("ideas", data)
}