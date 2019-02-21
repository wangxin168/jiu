// pages/jifen/jifen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navtab: ["积分收益", "消费明细"],
    currentTab: 0,
    shouyi: [],
    jifen: "",
    limit: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.shouyi()
    that.setData({
      jifen: options.jifen
    })
  },
  shouyi: function (e) {
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/integration_record',
      data: {
        user_token: user_token,
        state: 1,
        page_start: 0,
        page_end: that.data.limit
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
            shouyi: res.data.data.score_list
          })
        }
      }
    });
  },
  xiaofei: function (e) {
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/integration_record',
      data: {
        user_token: user_token,
        state: 2,
        page_start: 0,
        page_end: that.data.limit
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
            xiaofei: res.data.data.score_list
          })
        }

      }
    });
  },
  swichNav: function (e) {
    console.log(e)
    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      // return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })

    }
    if (e.target.dataset.current == 1) {
      that.xiaofei();
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

  // 上拉加载
  onReachBottom: function () {
    var that = this

    var user_token = wx.getStorageSync('user_token')
    that.setData({
      limit: that.data.limit + 10
    })
    wx.showLoading({
      title: '正在加载中'
    })
    // 判断currentTab等于几  就让他执行那个方法
    if (that.data.currentTab == 1) {
      var consignment = that.data.xiaofei
      console.log(that.data.currentTab)
      wx.request({
        url: getApp().globalData.url + '/index.php/Shop/UserApi/integration_record',
        data: {
          user_token: user_token,
          state: 2,
          page_start: 0,
          page_end: that.data.limit
        },
        success: res => {
          if (consignment.length == res.data.data.score_list.length) {
            wx.showToast({
              title: '没有更多数据了',
              icon: "none"
            })
          } else {
            that.setData({
              xiaofei: res.data.data.score_list
            })
          }
          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
        }
      });
    } else if (that.data.currentTab == 0) {
      var pay = that.data.shouyi
      wx.request({
        url: getApp().globalData.url + '/index.php/Shop/UserApi/integration_record',
        data: {
          user_token: user_token,
          state: 1,
          page_start: 0,
          page_end: that.data.limit
        },
        success: res => {
          if (pay.length == res.data.data.score_list.length) {
            wx.showToast({
              title: '没有更多数据了',
              icon: "none"
            })
          } else {
            that.setData({
              shouyi: res.data.data.score_list
            })
          }
          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
        }
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})