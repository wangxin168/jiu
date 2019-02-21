// pages/setting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  clearInfo:function(){
    wx.removeStorageSync('userImg');
    wx.removeStorageSync('userNames');
    wx.removeStorageSync('openids');
    wx.removeStorageSync('user_token');
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  /**关于我们 */
  aboutFun:function(){
    wx.navigateTo({
      url: '/pages/about/index'
    })
  }
})