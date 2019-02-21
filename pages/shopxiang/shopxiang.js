var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    goodid: "",
    shopxiang: {},
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    currentTab: 1,
    commend_goods_list: [],
    // 查看是否收藏
    is_shou: 2,
    // 收藏图片
    img: "",
    is_type: "",
    top:"",
    num: 1,
    goodname:"",
    ping:[],
    winHeight:"",
    xuanzhong:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      goodid: options.goodid,
      is_type: options.type
    })
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc,
          imgHeight: clientWidth * rpxR,
          systemInfo: res,
        });
        if (res.platform == "ios") {
          that.setData({
            chang: 1
          })
        } else if (res.platform == "android") {
          that.setData({
            chang: 2
          })
        }
      }
      
    });

    // 商品详情
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/goods_details_api',
      data: {
        is_type: options.type,
        goods_id: options.goodid
      },
      success: res => {
        
        wx.setNavigationBarTitle({
          title: res.data.data.goods_info.goods_name
        })
        that.setData({
          shopxiang: res.data.data.goods_info,
          commend_goods_list: res.data.data.commend_goods_list
        })
        let contents = res.data.data.goods_info.goods_content
        WxParse.wxParse('contents', 'html', contents, that);
      }
    });
    that.chakan()
  },
  // 加入购物车
  addgouwu: function (e) {
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/add_car_api',
      data: {
        user_token: user_token,
        goods_id: e.currentTarget.dataset.goodid,
        goods_num: 1
      },
      success: res => {
         console.log(res)
        if (res.data.status == 3) {
          wx.navigateTo({
            url: '/pages/login/index',
          })
        }
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  chakan: function () {
    var that = this
    // 查看收藏
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/query_goods_is_collect_api',
      data: {
        user_token: user_token,
        goods_id: that.data.goodid
      },
      success: res => {
        if (res.data.data != null) {
          that.setData({
            is_shou: res.data.data.is_collect_status
          })
        }
      }
    });
  },
  gouwuche: function (e) {
      wx.switchTab({
        url: '/pages/gouwu/gouwu'
      })
  },
  shopxiang: function (e) {
    wx.navigateTo({
      url: '/pages/shopxiang/shopxiang?goodid=' + e.currentTarget.dataset.goodid + "&type=" + e.currentTarget.dataset.type + "&goodname=" + e.currentTarget.dataset.goodname
    })
  },
  queding: function (e) {
    var that = this
      wx.navigateTo({
        url: '/pages/queding/queding?goodid=' + e.currentTarget.dataset.goodid + "&num=" + that.data.num 
      })
  },
  shoucang: function (e) {
    var that = this;
    var user_token = wx.getStorageSync('user_token')
      if (that.data.is_shou == 2) {
        wx.request({
          url: app.globalData.url + '/index.php/Shop/api/add_or_cancel_collect_api',
          data: {
            user_token: user_token,
            goods_id: that.data.goodid,
            is_type: 1
          },
          success: res => {
            if (res.data.status == 3) {
              wx.navigateTo({
                url: '/pages/login/index',
              })
            }
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
            that.chakan()
          }
        });
      } else {
        wx.request({
          url: app.globalData.url + '/index.php/Shop/api/add_or_cancel_collect_api',
          data: {
            user_token: user_token,
            goods_id: that.data.goodid,
            is_type: 2
          },
          success: res => {
            if (res.data.status == 3) {
              wx.navigateTo({
                url: '/pages/login/index',
              })
            }
            wx.showToast({
              title: res.data.message,
              icon: "none"
            })
            that.chakan()
          }
        });
      }
  },
  add: function (e) {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  jian: function (e) {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  // 加入购物车
  addshop: function (e) {
    var that = this
    var user_token = wx.getStorageSync('user_token');
      wx.request({
        url: getApp().globalData.url + '/index.php/Shop/api/add_car_api',
        data: {
          user_token: user_token,
          goods_id: that.data.goodid,
          goods_num: that.data.num
        },
        success: res => {
          console.log(res)
          if (res.data.status == 3) {
            wx.redirectTo({
              url: '/pages/login/index',
            })
          }
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
      });
    
  },
  swichNav: function (e) {
    var that = this;
    that.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx==3){
      that.pingjia()
    }
  },
  pingjia:function(e){
    var that=this;
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/goods_comment_list_api',
      data: {
        goods_id: that.data.goodid
      },
      success: res => {
        console.log(res.data.data.comment_list)
        if (res.data.data == null) {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        } else {
          that.setData({
            ping: res.data.data.comment_list
          })
        }
      }
    });
  }
})