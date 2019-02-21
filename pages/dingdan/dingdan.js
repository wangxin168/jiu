let app =getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navtab: ["待付款", "待发货", "待收货", "已完成", "退款"],
    currentTab: 0,
    winWidth:"",
    winHeight:"",
    fahuo:[],
    shouhuo:[],
    wancheng:[],
    fukuan:[],
    limit:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    if (options.idn!=undefined){
        that.setData({
          currentTab: options.idn
        })
    }
  },
  onShow: function () {
    var that = this
    var user_token = wx.getStorageSync('user_token');
    /**退款 */
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/my_order_refund_list_api',
      data: {
        user_token: user_token,
        page_start: 0,
        page_end: that.data.limit
      },
      success: function (res) {
        console.log(res)
        if (res.data.data == null) {
          return false
        } else {
          that.setData({
            tuikuan: res.data.data.refund_list
          })
        }
      }
    });
    /**已完成 */
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/my_order_list_api',
      data: {
        user_token: user_token,
        is_status: 4,
        page_start: 0,
        page_end: that.data.limit
      },
      success: function (res) {
        if (res.data.data == null) {
          that.setData({
            wancheng: []
          })
        } else {
          that.setData({
            wancheng: res.data.data.order_list
          })
        }
      }
    });
    /**待收货 */
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/my_order_list_api',
      data: {
        user_token: user_token,
        is_status: 3,
        page_start: 0,
        page_end: that.data.limit
      },
      success: function (res) {
        console.log(res)
        if (res.data.data == null) {
          that.setData({
            shouhuo: []
          })
        } else {
          that.setData({
            shouhuo: res.data.data.order_list
          })
        }
      }
    });
    /**代发货 */
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/my_order_list_api',
      data: {
        user_token: user_token,
        is_status: 2,
        page_start: 0,
        page_end: that.data.limit
      },
      success: function (res) {
        if (res.data.data == null) {
          that.setData({
            fahuo: []
          })
        } else {
          that.setData({
            fahuo: res.data.data.order_list
          })
        }
      }
    });
    
    /**待付款 */
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/my_order_list_api',
      data: {
        user_token: user_token,
        is_status: 1,
        page_start: 0,
        page_end: that.data.limit
      },
      success: function (res) {
        if (res.data.data == null) {
          that.setData({
            fukuan: []
          })
        } else {
          that.setData({
            fukuan: res.data.data.order_list
          })
        }
      }
    });
  },
  // 评价
  pingjia:function(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/pingjia/pingjia?goodid=' + e.currentTarget.dataset.goodid + "&orderid=" + e.currentTarget.dataset.orderid + "&type=" + e.currentTarget.dataset.type + "&goodname=" + e.currentTarget.dataset.goodname
    })
  },
  // 删除
  shanchu:function(e){
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.showModal({
      title: '提示',
      content: '确定要删除',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + '/index.php/Shop/api/delete_order_api',
            data: {
              user_token: user_token,
              order_id: e.currentTarget.dataset.orderid
            },
            success: function (res) {
              console.log(res)
              if (res.data.data == null) {
                wx.showToast({
                  title: res.data.message,
                  icon: "none"
                })
                that.onShow();
                return false
              } else {
                wx.showToast({
                  title: "删除失败",
                  icon: "none"
                })
              }
            }
          })
        } else if (res.cancel) {
        }
      }
    }) 
    
  },
  // 申请退款
  shenkuan: function (e) {
    var that = this
    console.log(that.data.fahuo[e.currentTarget.dataset.goodid].goods_list)
    // 判断列表里的长度是否等于1  如果是跳转申请理由页面   如果不是跳转选择退款商品页面
    if (that.data.fahuo[e.currentTarget.dataset.goodid].goods_list.length == 1) {
      var arr = [];
      arr.push(that.data.fahuo[e.currentTarget.dataset.goodid].goods_list[0].goods_id)
      wx.navigateTo({
        url: '/pages/tuikuan/tuikuan?orderid=' + e.currentTarget.dataset.orderid + "&arr=" + arr
      })
    } else {
      wx.navigateTo({
        url: '/pages/checkedtui/checkedtui?orderid=' + e.currentTarget.dataset.orderid
      })
    }
  },
  // 申请退款
  shentui:function(e){
    var that=this
    console.log(that.data.shouhuo[e.currentTarget.dataset.goodid].goods_list.length)
    // 判断列表里的长度是否等于1  如果是跳转申请理由页面   如果不是跳转选择退款商品页面
    if (that.data.shouhuo[e.currentTarget.dataset.goodid].goods_list.length==1){
      var arr = [];
      arr.push(that.data.shouhuo[e.currentTarget.dataset.goodid].goods_list[0].goods_id)
      wx.navigateTo({
        url: '/pages/tuikuan/tuikuan?orderid=' + e.currentTarget.dataset.orderid + "&arr=" + arr
      })
    }else{
      wx.navigateTo({
        url: '/pages/checkedtui/checkedtui?orderid=' + e.currentTarget.dataset.orderid
      })
    }
  },
  // 点击切换
  swichNav: function (e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  // 取消付款
  qvxiao: function (e) {
    var that = this;
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/cancel_order_api',
      data: {
        user_token: user_token,
        order_id: e.currentTarget.dataset.orderid
      },
      success: res => {
        if (res.data.data == null) {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          that.onShow();
          return false
        } else {
        }
      }
    });
  },
  // 确认收货
  queshou: function (e) {
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/confirm_receipt_api',
      data: {
        user_token: user_token,
        order_id: e.currentTarget.dataset.queshou
      },
      success: function (res) {
        if (res.data.data == null) {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          wx.redirectTo({
            url: '/pages/dingdan/dingdan?idn=' + 3
          })
          
        } else {

        }
        
      }
    })
  },
  nofu:function(e){
    wx.navigateTo({
      url: '/pages/dingxiang/dingxiang?orderid=' + e.currentTarget.dataset.orderid
    })
  },
  shopxiang: function (e) {
    wx.navigateTo({
      url: '/pages/shopxiang/shopxiang?goodid=' + e.currentTarget.dataset.goodid + "&type=" + e.currentTarget.dataset.type
    })
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this
    var user_token = wx.getStorageSync('user_token');
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
    // 判断currentTab等于几  就让他执行那个方法
    if (that.data.currentTab == 4) {
      var allGoods = that.data.tuikuan
      wx.request({
        url: getApp().globalData.url + '/index.php/Shop/api/my_order_refund_list_api',
        data: {
          user_token: user_token,
          page_start: 0,
          page_end: that.data.limit
        },
        success: res => {
          if (allGoods.length == res.data.data.refund_list.length) {
            wx.showToast({
              title: '没有更多数据了',
              icon: "none"
            })
          } else {
            that.setData({
              tuikuan: res.data.data.refund_list
            })
          }
          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
        }
      });
    } else if (that.data.currentTab == 3) {
      var success = that.data.wancheng
      wx.request({
        url: getApp().globalData.url + '/index.php/Shop/api/my_order_list_api',
        data: {
          user_token: user_token,
          is_status: 4,
          page_start: 0,
          page_end: that.data.limit
        },
        success: res => {
          if (success.length == res.data.data.order_list.length) {
            wx.showToast({
              title: '没有更多数据了',
              icon: "none"
            })
          } else {
            that.setData({
              wancheng: res.data.data.order_list
            })
          }
          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
        }
      });
    } else if (that.data.currentTab == 2) {
      var delivery = that.data.shouhuo
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/my_order_list_api',
        data: {
          user_token: user_token,
          is_status: 3,
          page_start: 0,
          page_end: that.data.limit
        },
        success: res => {
          if (delivery.length == res.data.data.order_list.length) {
            wx.showToast({
              title: '没有更多数据了',
              icon: "none"
            })
          } else {
            that.setData({
              shouhuo: res.data.data.order_list
            })
          }
          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
        }
      });
    } else if (that.data.currentTab == 1) {
      var consignment = that.data.fahuo
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/my_order_list_api',
        data: {
          user_token: user_token,
          is_status: 2,
          page_start: 0,
          page_end: that.data.limit
        },
        success: res => {
          if (consignment.length == res.data.data.order_list.length) {
            wx.showToast({
              title: '没有更多数据了',
              icon: "none"
            })
          } else {
            that.setData({
              fahuo: res.data.data.order_list
            })
          }
          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
        }
      });
    } else if (that.data.currentTab == 0) {
      var pay = that.data.fukuan
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/my_order_list_api',
        data: {
          user_token: user_token,
          is_status: 1,
          page_start: 0,
          page_end: that.data.limit
        },
        success: res => {
          if (pay.length == res.data.data.order_list.length) {
            wx.showToast({
              title: '没有更多数据了',
              icon: "none"
            })
          } else {
            that.setData({
              fukuan: res.data.data.order_list
            })
          }
          setTimeout(function () {
            wx.hideLoading();
          }, 2000)
        }
      });
    }
  },
  
})