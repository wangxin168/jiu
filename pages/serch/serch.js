// pages/serch/serch.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chaner: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  voteTitle: function (e) {

    var value = e.detail.value;
    if (value == "") {
      return false
    }
    var that = this;
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/search_api',
      data: {
        search_val: value
      },
      success: res => {
        if (res.data.message != "未找到相关商品") {
          that.setData({
            chaner: res.data.data.goods_list
          })
        }else{
          wx.showToast({
            title: "未找到相关商品",
            icon: "none"
          })
        }
      }
    });
  },
  shopxiang: function (e) {
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