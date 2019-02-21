// pages/shouc/shouc.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shouc: "",
    limit: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });

      }

    });

  },
  chakan: function () {
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/collect_list_api',
      data: {
        user_token: user_token,
        page_start: 0,
        page_end: that.data.limit
      },
      success: res => {
        console.log(res)
        that.setData({
          shouc: res.data.data.collect_goods_list
        })
      }
    });
  },
  shopxiang: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/shopxiang/shopxiang?goodid=' + e.currentTarget.dataset.goodid + "&type=" + e.currentTarget.dataset.type
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
    var that = this
    that.chakan()
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

  // 下拉刷新
  onPullDownRefresh: function () {
    console.log(111)
    var that = this
    that.onShow();
  },

  // 上拉加载
  onReachBottom: function () {
    var that = this
    console.log(that.data.currentTab)
    var user_token = wx.getStorageSync('user_token')
    that.setData({
      limit: that.data.limit + 10
    })
    wx.showLoading({
      title: '正在加载中'
    })

    var pay = that.data.shouc
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/collect_list_api',
      data: {
        user_token: user_token,
        page_start: 0,
        page_end: that.data.limit
      },
      success: res => {
        if (pay.length == res.data.data.collect_goods_list.length) {
          wx.showToast({
            title: '没有更多数据了',
            icon: "none"
          })
        } else {
          that.setData({
            shouc: res.data.data.collect_goods_list
          })
        }
        setTimeout(function () {
          wx.hideLoading();
        }, 2000)
      }
    });

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})