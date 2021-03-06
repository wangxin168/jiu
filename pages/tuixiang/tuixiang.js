// pages/tuixiang/tuixiang.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xiang:"",
    xiangqing:{},
    title:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      xiang:options.xiang,
      title:options.title
    })
    wx.setNavigationBarTitle({
      title: that.data.title//页面标题为路由参数
    })
    // 推荐详情
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/goods_commend_details_api',
      data: {
        commend_id: that.data.xiang
      },
      success: res => {
        that.setData({
          xiangqing: res.data.data
        })
        let contents = res.data.data.goods_commend_content
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