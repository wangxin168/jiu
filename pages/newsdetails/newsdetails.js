// pages/newsdetails/newsdetails.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    letterid:"",
    letter_list:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      letterid: options.letterid
    })

    var user_token = wx.getStorageSync('user_token')
    // 消息详情
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/my_letter_details_api',
      data: {
        user_token: user_token,
        letter_id: that.data.letterid
      },
      success: res => {
        that.setData({
          letter_list: res.data.data
        })
        let contents = res.data.data.letter_content
        WxParse.wxParse('contents', 'html', contents, that);
      }
    });

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