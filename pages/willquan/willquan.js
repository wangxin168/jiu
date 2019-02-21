var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wei: [],
    shuzuzu: [],
    coupon_condition:0,
    // goodsTotals:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.globalData.disco = 0
    that.setData({
      goodid: options.goodid,
      num: options.num,
      // goodsTotals: options.goodsTotals
    })
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/goods_confirm_api',
      data: {
        user_token: user_token,
        goods_id: options.goodid,
        is_shopping: 2,
        goods_num: options.num
      },
      success: res => {
        console.log(res.data.data)
        that.setData({
          shuzuzu: res.data.data.coupon_info.coupon_list,
          length: res.data.data.coupon_info.coupon_list.length,
          // 确认也总价的价格
          goodsTotals: res.data.data.order_info.order_price
        })

      }
    });
  },

  shiyong: function (e) {
    var that = this
    that.setData({
      coupon_condition: e.currentTarget.dataset.condition
    })
    // 杨邓  这块的注释不要删不要删不要删不要删不要删

    // wx.reLaunch({
    //   url: '/pages/queding/queding?coupon=' + e.currentTarget.dataset.coupon + "&goodid=" + that.data.goodid + "&num=" + that.data.num + "&name=" + e.currentTarget.dataset.name + "&price=" + e.currentTarget.dataset.price
    // })

    
    app.globalData.disco = e.currentTarget.dataset.price
    console.log(e.currentTarget.dataset.price)
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    wx.navigateBack();
    prevPage.setData({
      coupon: e.currentTarget.dataset.coupon,
      goodid: that.data.goodid,
      num: that.data.num,
      name: e.currentTarget.dataset.name,
      price: e.currentTarget.dataset.price,
      // 指得是 满100减10元 的100
      coupon_condition: that.data.coupon_condition
    })
    console.log(that.data.coupon_condition)
  },
  bushiyong: function (e) {
    var that = this
    // 重点  需要跳转多层再跳转回来 用此方法  找到上一层的setData传参  跳转
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    wx.navigateBack();
    prevPage.setData({
      coupon: "",
      goodid: that.data.goodid,
      num: that.data.num,
      name: "",
      price: e.currentTarget.dataset.price
    })
  }
})