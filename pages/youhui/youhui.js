// pages/youhui/youhui.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navtab: ["未使用", "已使用", "已过期"],
    currentTab: 0,
    wei:[],
    yiyong: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.will()
  },
  will: function (e) {
    let that = this

    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/coupon_list',
      data: {
        user_token: user_token,
        state:2
      },
      success: function (res) {
        if (res.data.data == null) {
          wx.showToast({
            title: "暂无优惠券",
            icon: "none"
          })
          return false
        } else {
          that.setData({
            wei: res.data.data.coupon_list
          })
        }
      },
      fail: function (res) {
        console.log(222)
      }
    });
  },
  did: function (e) {
    let that = this

    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/coupon_list',
      data: {
        user_token: user_token,
        state: 1
      },
      success: function (res) {
        if (res.data.data == null) {
          wx.showToast({
            title: "暂无已使用的优惠券",
            icon: "none"
          })
          return false
        } else {
          that.setData({
            yiyong: res.data.data.coupon_list
          })
        }
      }
    });
  },
  guoqi: function (e) {
    let that = this

    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/coupon_list',
      data: {
        user_token: user_token,
        state: 3
      },
      success: function (res) {
        console.log(res)
        if (res.data.data == null) {
          wx.showToast({
            title: "暂无过期优惠券",
            icon: "none"
          })
          return false
        } else {
          that.setData({
            guoqi: res.data.data.coupon_list
          })
        }
      }
    });
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      // return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })

    }
    if (e.target.dataset.current == 1) {
      that.did();
    } 
    else if (e.target.dataset.current == 2) {
      that.guoqi();
    }
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