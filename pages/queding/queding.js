var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodid: "",
    num: "",
    queshop: {},
    checked: false,
    weixin: true,
    order_info: {},
    address_info: {},
    length: 0,
    coupon: '',
    name: "",
    beizhu: "",
    is_pay: 1,
    is_default: "",
    userNames: "",
    price: "",
    is_use_score: "2",
    type: 1,
    addresslength: 0,
    // 默认的地址的id名要和shuzu传的一样
    addressid: "",
    // coupon_condition:0,
    // 总价
    goodsTotals: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


    var that = this;
    // 优惠券id
    if (options.coupon == undefined) {
      that.setData({
        coupon: ""
      });
    } else {
      if (options.coupon != "") {
        that.setData({
          coupon: options.coupon,
        })
      } else {
        coupon: ""
      }
    }
    // 优惠券名称
    if (options.name == undefined) {
      that.setData({
        name: ""
      });
    } else {
      if (options.name != "") {


        that.setData({
          name: options.name,
        })
      } else {
        name: ""
      }
    }
    // 价格
    if (options.price == undefined) {
      that.setData({
        price: ""
      });
    } else {
      that.setData({
        price: options.price,
      })
    }


    // 数量
    if (options.num != undefined) {
      that.setData({
        num: options.num
      })
    }

    that.setData({
      goodid: options.goodid
    })
  },
  tixing: function (e) {
    wx.showToast({
      title: "优惠券与积分抵扣两者只能选其一",
      icon: "none"
    })
  },
  bindCheckbox: function (e) {
    var that = this
    // 积分
    var checked = that.data.checked
    if (that.data.coupon != "") {
      that.setData({
        checked: checked
      })
      wx.showToast({
        title: "优惠券与积分抵扣两者只能选其一",
        icon: "none"
      })
    } else if (that.data.order_info.order_score == 0) {
      that.setData({
        checked: checked
      })
    }else {
      that.setData({
        checked: !checked
      })
    }
    if (that.data.checked == true) {
      that.setData({
        is_use_score: 1
      })

    } else {
      that.setData({
        is_use_score: 2
      })
    }
  },
  weixin: function (e) {
    var that = this
    // 微信
    var weixin = that.data.weixin
    that.setData({
      weixin: !weixin
    })
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
      url: app.globalData.url + '/index.php/Shop/api/goods_confirm_api',
      data: {
        user_token: user_token,
        goods_id: that.data.goodid,
        is_shopping: 2,
        goods_num: that.data.num
      },
      success: res => {
        console.log(res)
        if (res.data.status == 3) {
          wx.navigateTo({
            url: '/pages/login/index',
          })
          return;
        }
        if (res.data.data.coupon_info.is_coupon == 1) {
          that.setData({
            length: res.data.data.coupon_info.coupon_list.length,
            goodsTotals: res.data.data.order_info.order_price
          })
        } else {
          that.setData({
            length: 0
          })
        }
        console.log(res.data.data.goods_info)

        that.setData({
          queshop: res.data.data.goods_info,
          order_info: res.data.data.order_info,
          is_default: res.data.data.address_info.is_default,
          userNames: wx.getStorageSync('userNames'),
          order_price: Number(that.data.goodsTotals) - app.globalData.disco
        })


        // 地址
        if (that.data.shuzu == undefined) {
          that.setData({
            address_info: res.data.data.address_info,
            addressid: res.data.data.address_info.address_id
          })
          //  console.log(that.data.addressid)
        } else {
          that.setData({
            address_info: JSON.parse(that.data.shuzu),
            addressid: that.data.address_info.id
          })
          console.log(that.data.addressid)
        }
      }
    });
  },
  willquan: function (e) {
    var that = this
    wx.navigateTo({
      url: '/pages/willquan/willquan?goodid=' + that.data.goodid + "&num=" + that.data.num + "&goodsTotals=" + that.data.goodsTotals
    })
  },
  zhifu: function (e) {
    var that = this
    let isRegst = wx.getStorageSync('isRegist');
    if (isRegst == 2) {
      wx.redirectTo({
        url: '/pages/bindPhone/index',
      })
      return false
    }
    var user_token = wx.getStorageSync('user_token')
    // 判断抵扣积分现在的状态
    if (that.data.checked == true) {
      that.setData({
        is_use_score: 1
      })
    } else {
      that.setData({
        is_use_score: 2
      })
    }
    if (that.data.shuzu == undefined && that.data.address_info.address_id == undefined) {
      wx.showToast({
        title: '请选择收货地址',
        icon: "none"
      })
      return;
    }
    if (that.data.weixin == true) {
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/order_pay_api',
        data: {
          user_token: user_token,
          goods_id: that.data.goodid,
          goods_num: that.data.num,
          is_shopping: 2,
          address_id: that.data.addressid,
          is_pay: 3,
          // 抵扣积分
          is_use_score: that.data.is_use_score,
          // 优惠券id
          coupon_grant_id: that.data.coupon,
          // 备注
          order_remark: that.data.beizhu,
          is_xcx: 1
        },
        success: res => {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            "package": res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: function (res) {

              wx.showToast({ title: '支付成功', icon: 'success', duration: 2000 });

              setTimeout(function doHandler() {

                wx.reLaunch({
                  url: '/pages/reserve/index'
                })

              }, 2000);
              setTimeout(function () {
                wx.navigateTo({
                  url: '/pages/dingdan/dingdan?idn=' + 1
                })
              }, 2000)
            },
            fail: function (res) {
              console.log(res)
              wx.showToast({ title: '支付失败', icon: 'none', duration: 2000 });
            }
            
          })
        }
      });
    } else {
      wx.showToast({
        title: '请选择支付方式',
        icon: "none"
      })
      return;
    }

  },
  dizhi: function (e) {
    var that = this
    wx.navigateTo({
      url: '/pages/dizhi/dizhi?goodid=' + that.data.goodid + "&num=" + that.data.num
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    // 地址
    if (that.data.shuzu == undefined) {
      that.setData({
        address_info: ""
      });
    } else {
      that.setData({
        address_info: JSON.parse(that.data.shuzu),
        addressid: that.data.address_info.id
      })
    }
    that.xuanran()
  }
})