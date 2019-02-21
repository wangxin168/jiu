// pages/xiaoxi/xiaoxi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    letter_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var user_token = wx.getStorageSync('user_token')
    // 消息
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/my_letter_list_api',
      data: {
        user_token: user_token
      },
      success: res => {
        console.log(res)
        if(res.data.data==null){
          wx.showToast({
            title: res.data.message,
            icon:"none"
          })
        }else{
          that.setData({
            letter_list: res.data.data.letter_list
          })
        }
        
      }
    });
  },
  newsdetails:function(e){
    wx.navigateTo({
      url: '/pages/newsdetails/newsdetails?letterid=' + e.currentTarget.dataset.letterid
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
  
  }
})