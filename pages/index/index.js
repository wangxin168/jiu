const app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    img: [],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    xinwen:[],
    reverse:[],
    chanpin:[],
    tuijian:[],
    swiperCurrent:0
  },
  swiperChange:function(e){
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    /**判断当前用户是否授权登陆 */
    // if (wx.getStorageSync('openids') == '' && wx.getStorageSync('user_token') == '' && wx.getStorageSync('isRegist') == '') {
    //   wx.redirectTo({
    //     url: '/pages/login/index',
    //   })
    // }
    wx.login({
      success: res => {
        wx.request({
          url: getApp().globalData.url + '/index.php/Shop/api/get_user_info_api',
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data,"灌酒打印")
            if (res.data.status == 1) {
              wx.setStorageSync('openids', res.data.data.openid);
              wx.setStorageSync('user_token', res.data.data.user_token);
              wx.setStorageSync('isRegist', res.data.data.is_register);
            }
            if (res.data.data.is_register == 2) {
              wx.redirectTo({
                url: '/pages/login/index',
              })
            }
          }
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 轮播
    var that=this
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/carousel_api',
      success: res => {
        that.setData({
          img:res.data.data
        })
      }
    });
    // 新闻
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/news_api',
      success: res => {
        var a=res.data.data
        var b = res.data.data.reverse()
        
        that.setData({
          xinwen: res.data.data
        })
        
      }
    });
    
    // 分类列表
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/classify_api',
      success: res => {
        console.log(res)
        that.setData({
          chanpin: res.data.data
        })
      }
    });
    // 推荐列表
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/goods_commend_api',
      success: res => {
        that.setData({
          tuijian: res.data.data
        })
      }
    });
    
    // 三个列表
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/type_list_api',
      data: {
        is_type: 2
      },
      success: res => {
        that.setData({
          san: res.data.data
        })
      }
    });
  },
  
  // 加入购物车
  addshop: function (e) {
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/add_car_api',
      data: {
        user_token: user_token,
        goods_id: e.currentTarget.dataset.goodid,
        goods_num: 1
      },
      success: res => {
        if (res.data.status == 3) {
          wx.redirectTo({
            url: '/pages/login/index',
          })
        }
        that.setData({
          // is_shou: res.data.data.is_collect_status
        })
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  serch:function(e){
    wx.navigateTo({
      url: '/pages/serch/serch'
    })
  },
  tuixiang:function(e){
    wx.navigateTo({
      url: '/pages/tuixiang/tuixiang?xiang=' + e.currentTarget.dataset.xiang + "&title=" + e.currentTarget.dataset.title
    })
  },
  chaner:function(e){
    wx.navigateTo({
      url: '/pages/chaner/chaner?typeid=' + e.currentTarget.dataset.typeid + "&type=" + e.currentTarget.dataset.type + "&nochuan=" + e.currentTarget.dataset.nochuan + "&name=" + e.currentTarget.dataset.name + "&twotypeid=" + e.currentTarget.dataset.twotypeid
    })
  },
  xinwen:function(e){
    wx.navigateTo({
      url: '/pages/zixun/zixun?news=' + e.currentTarget.dataset.news
    })
  },
  sange:function(e){
    wx.navigateTo({
      url: '/pages/sange/sange?type=' + e.currentTarget.dataset.type + "&name=" + e.currentTarget.dataset.name
    })
  },
  shopdetails:function(e){
    var that=this;
    if (e.currentTarget.dataset.isgood==1){
      wx.navigateTo({
        url: '/pages/shopxiang/shopxiang?goodid=' + e.currentTarget.dataset.goodid + "&type=" + e.currentTarget.dataset.type
      })
    } else if (e.currentTarget.dataset.isgood == 2){
      return false;
    }
    
  },
  shopxiang: function (e) {
    wx.navigateTo({
      url: '/pages/shopxiang/shopxiang?goodid=' + e.currentTarget.dataset.goodid + "&type=" + e.currentTarget.dataset.type + "&goodname=" + e.currentTarget.dataset.goodname
    })
  },
  xiaoxi: function (e) {
    wx.navigateTo({
      url: '/pages/xiaoxi/xiaoxi'
    })
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getPhoneNumber:function(e){
  }

})
