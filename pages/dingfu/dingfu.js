// pages/dingfu/dingfu.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jine: "",
    orderid: "",
    weixin: true,
    is_pay: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      jine: options.jine,
      orderid: options.orderid
    })
  },
  weixin: function (e) {
    var that = this
    // 微信
    var weixin = that.data.weixin
    that.setData({
      weixin: !weixin
    })
  },

  zhifu: function () {
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/my_order_again_pay_api',
      data: {
        user_token: user_token,
        order_id: that.data.orderid,
        is_pay: 3,
        order_remark: that.data.beizhu,
        is_xcx: 1
      },
      success: res => {
        console.log(res)
        console.log(that.data.weixin)
        
        if (that.data.weixin==true) {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          wx.requestPayment({
            timeStamp: String(res.data.data.timeStamp),
            nonceStr: String(res.data.data.nonceStr),
            package: String(res.data.data.package),
            paySign: String(res.data.data.paySign),
            signType: String(res.data.data.signType),

            success: function (res) {

              wx.showToast({ title: '支付成功', icon: 'success', duration: 2000 });

              setTimeout(function doHandler() {

                wx.reLaunch({
                  url: '/pages/reserve/index'
                })

              }, 2000);

              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/dingdan/dingdan?idn=' + 1
                })
              }, 2000)

            },
            fail: function (res) {
              console.log(res)
              wx.showToast({ title: '支付失败', icon: 'none', duration: 2000 });
            }
          })
        }else{
          wx.showToast({
            title: '请选择支付方式',
            icon: "none"
          })
        }
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