// pages/dingxiang/dingxiang.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:""
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      orderid: options.orderid
    })
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });

      }

    });

  },
  userNameInput: function (e) {
    this.setData({
      beizhu: e.detail.value
    })
  },
  xuanran: function () {
    var that = this;
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/order_details_api',
      data: {
        user_token: user_token,
        order_id:that.data.orderid
      },
      success: res => {
        console.log(res)
        that.setData({
          xiang: res.data.data,
          shop: res.data.data.order_goods_list
        })
      }
    });
  },
  qvxiao:function(e){
    var that = this;
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/cancel_order_api',
      data: {
        user_token: user_token,
        order_id: that.data.orderid
      },
      success: res => {
        console.log(res)
        if (res.data.data == null) {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          return false
        } else {
          that.setData({
            // jilu: res.data.data.welfare_card
          })
        }
      }
    });
  },
  fukuan:function(e){
    var that=this;
    wx.navigateTo({
      url: '/pages/dingfu/dingfu?orderid=' + e.currentTarget.dataset.orderid + "&jine=" + e.currentTarget.dataset.jine+"&beizhu=" + that.data.beizhu
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
    var that = this;
    that.xuanran()
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