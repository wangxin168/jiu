// pages/pingjia/pingjia.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: [],
    arr: [],
    orderid: "",
    value: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options)
    this.setData({
      arr: options.arr.split(","),
      orderid: options.orderid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //图片上传

  up_img: function (e) {
    console.log(e)
    var that = this;
    var user_token = wx.getStorageSync('user_token')
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // console.log(res)

        var tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths: res.tempFilePaths
        })

      }
    })
  },
  bindFormSubmit: function (e) {
    var that = this;
    var user_token = wx.getStorageSync('user_token')
    var a = this.data.tempFilePaths
    var b = a.join(',')
    if (e.detail.value.textarea.replace(/\s+/g, '') == "") {
      wx.showToast({
        title: "请填写退款理由",
        icon: "none"
      })
      return;
    } else {
    if (b == null || b == "") {
      wx.request({
        url: getApp().globalData.url + '/index.php/Shop/api/apply_refund_api',
        name: 'refund_img',
        data: {
          user_token: user_token,
          order_id: that.data.orderid,
          order_goods_id_arr: "[" + that.data.arr + "]",
          refund_content: e.detail.value.textarea
        },
        success(res) {
          console.log(res)
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/dingdan/dingdan?idn=4',
            })
          }, 1000)
          
        }
      })
    }else{
      wx.uploadFile({
        url: getApp().globalData.url + '/index.php/Shop/api/apply_refund_api',
        filePath: b,
        name: 'refund_img',
        formData: {
          user_token: user_token,
          order_id: that.data.orderid,
          order_goods_id_arr: "[" + that.data.arr + "]",
          refund_content: e.detail.value.textarea

        },
        success(res) {
          console.log(res)
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/dingdan/dingdan?idn=4',
            })
          }, 1000)
        }
      })
    }
    }
  }
})