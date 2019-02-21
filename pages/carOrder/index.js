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
    order_info: {},
    address_info: {},
    length: 0,
    coupon_info: [],
    coupon: '',
    name: "",
    beizhu: "",
    payWay: false,
    flag: 2,
    youhui: 0,
    addressid: ""
  },
  chooePay: function (e) {
    let that = this
    that.setData({
      flag: e.currentTarget.dataset.stys,
      payWay: e.currentTarget.dataset.stys
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    that.setData({
      goodid: options.goodid,
      ways: options.ways,
      prices: Number(options.priceTotal)
    })

    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: app.globalData.url + '/index.php/Shop/UserApi/personal',
      data: {
        user_token: user_token
      },
      success: res => {

        if (res.data.data != null) {
          that.setData({
            balance: res.data.data.user_money
          })
        }
      }
    });
    that.xuanran();

    wx.request({
      url: app.globalData.url + '/index.php/Shop/UserApi/personal',
      data: {
        user_token: user_token
      },
      success: res => {
        console.log(res.data.data)
        if (res.data.data != null) {
          that.setData({
            zhongxin: res.data.data
          })
        }
      }
    });
  },
  tixing: function (e) {
    wx.showToast({
      title: "优惠券与积分抵扣两者只能选其一",
      icon: "none"
    })
  },
  bindCheckbox: function (e) {
    var that = this
    /**判断当前积分是否够100 */
    if (that.data.zhongxin.user_now_score < 100) {
      wx.showToast({
        title: '你当前的积分不足一元',
        icon: "none"
      })
      return false
    }
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
    } else {
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
        car_id_arr: that.data.goodid.split(","),
        is_shopping: 1
      },
      success: res => {
        that.setData({
          copepay: that.data.prices + Number(res.data.data.order_info.ex_price),
          goodsTotals: res.data.data.order_info.order_price,
          order_info: res.data.data.order_info
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
        if (res.data.data.address_info.is_default == 2) {
          that.setData({
            addids: res.data.data.address_info.is_default
          })
        } else {
          that.setData({
            addids: 1
          })
        }
        that.setData({
          allData: res.data.data
        })
        if (that.data.shuzu == undefined) {
          that.setData({
            address_info: res.data.data.address_info,
          })
        } else {
          that.setData({
            address_info: JSON.parse(that.data.shuzu)
          })
        }
        if (res.data.data.coupon_info.is_coupon == 1) {
          that.setData({
            coupon_info: res.data.data.coupon_info.coupon_list,
            length: res.data.data.coupon_info.coupon_list.length,
            goodsTotals: res.data.data.order_info.order_price
          })
        } else {
          that.setData({
            coupon_info: [],
            length: 0
          })
        }
      }
    });
  },
  zhifu: function (e) {
    var that = this
    var openids = wx.getStorageSync('openids');
    if (openids == "") {
      wx.redirectTo({
        url: '/pages/login/index',
      })
      return false
    }
    var user_token = wx.getStorageSync('user_token');
    if (that.data.shuzu == undefined && that.data.address_info.address_id == undefined) {
      wx.showToast({
        title: '请选择收货地址',
        icon: "none"
      })
      return;
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
    if (that.data.payWay == false) {
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/order_pay_api',
        data: {
          user_token: user_token,
          car_id_arr: that.data.goodid.split(","),
          is_pay: 3,
          is_shopping: 1,
          address_id: that.data.addressid,
          order_remark: that.data.beizhu,
          is_xcx: 1,
          // 抵扣积分
          is_use_score: that.data.is_use_score,
          // 优惠券id
          coupon_grant_id: that.data.coupon
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
                wx.redirectTo({
                  url: '/pages/dingdan/dingdan?idn=' + 1
                })
              }, 2000)
            },
            fail: function (res) {
              console.log(res)
              wx.showToast({ title: '支付失败', icon: 'none', duration: 2000 });
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/dingdan/dingdan?idn=' + 0
                })
              }, 2000)
            }
          })
          that.setData({
            payWay: true
          })

        }

      });
    } else {
      if (that.data.shuzu == undefined && that.data.address_info.address_id == undefined) {
        wx.showToast({
          title: '请选择收货地址',
          icon: "none"
        })
        return;
      }
      if (that.data.goodsTotals > that.data.balance) {
        wx.showToast({
          title: '账户余额不足，请充值',
          icon: "none"
        })
        return false
      }
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/order_pay_api',
        data: {
          user_token: user_token,
          car_id_arr: that.data.goodid.split(","),
          is_pay: 1,
          is_shopping: 1,
          address_id: that.data.addressid,
          order_remark: that.data.beizhu,
          is_xcx: 1,
          // 抵扣积分
          is_use_score: that.data.is_use_score,
          // 优惠券id
          coupon_grant_id: that.data.coupon
        },
        success: res => {
          if (res.data.status == 1) {
            wx.showToast({
              title: "支付成功",
              icon: "none"
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '/pages/success/success'
              })
            }, 1000)

          } else {
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
          }
        },
        fail: function (res) {
          console.log(res)
          wx.showToast({ title: '支付失败', icon: 'none', duration: 2000 });
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/dingdan/dingdan?idn=' + 0
            })
          }, 2000)
        }
      });
    }

  },
  dizhi: function (e) {
    var that = this
    wx.navigateTo({
      url: '/pages/dizhi/dizhi?goodid=' + that.data.goodid + "&num=" + that.data.num
    })
  },
  // willquan: function (e) {
  //   var that = this
  //   var shuzu = JSON.stringify(that.data.coupon_info)

  //   wx.navigateTo({
  //     url: '/pages/willquan/willquan?shuzu=' + shuzu + "&goodid=" + that.data.goodid + "&num=" + that.data.num + "&copePrice=" + that.data.copepay
  //   })
  // },
  willquan: function (e) {
    var that = this
    console.log(that.data.num)

    wx.navigateTo({
      url: '/pages/willquan/willquan?goodid=' + that.data.goodid + "&num=" + that.data.num
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

    that.setData({
      prices: that.data.prices,
      youhui: app.globalData.disco
    })
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