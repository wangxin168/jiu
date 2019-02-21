var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhongxin: {},
    nackname: "",
    touxiang:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that=this;
    var headimgs = wx.getStorageSync('userImg');
    that.setData({
      touxiang: headimgs
    })
  },
  xinxi:function(e){
    var that = this
    var user_token = wx.getStorageSync('user_token');
    console.log(user_token,"token值CEO")
    wx.request({
      url: app.globalData.url + '/index.php/Shop/UserApi/personal',
      data: {
        user_token: user_token
      },
      success: res => {
        console.log(res)
        if (res.data.status == 3) {
          wx.navigateTo({
            url: '/pages/login/index',
          })
        }
        if (res.data.data!=null){
          that.setData({
            zhongxin: res.data.data,
            nackname: res.data.data.user_nickname,
            qiandao: res.data.data.is_qd
          })
        }
      }
    });
  },
  geren: function (e) {
    var that = this
    wx.navigateTo({
      url: '/pages/geren/geren?nackname=' + that.data.nackname + "&touxiang=" + e.currentTarget.dataset.touxiang
    })
  },
  xiaoxi: function (e) {
    wx.navigateTo({
      url: '/pages/xiaoxi/xiaoxi'
    })
  },
  ding: function (e) {
    wx.navigateTo({
      url: '/pages/dingdan/dingdan'
    })
  },
  fukuan: function (e) {
    wx.navigateTo({
      url: '/pages/dingdan/dingdan?idn=' + 0 
    })
  },
  fahuo: function (e) {
    wx.navigateTo({
      url: '/pages/dingdan/dingdan?idn=' + 1
    })
  },
  shouhuo: function (e) {
    wx.navigateTo({
      url: '/pages/dingdan/dingdan?idn=' + 2
    })
  },
  tuihuo: function (e) {
    wx.navigateTo({
      url: '/pages/dingdan/dingdan?idn=' + 4
    })
  },

  youhui: function (e) {
    wx.navigateTo({
      url: '/pages/youhui/youhui'
    })
  },
  jifen: function (e) {
    wx.navigateTo({
      url: '/pages/jifen/jifen?jifen=' + e.currentTarget.dataset.jifen
    })
  },
  dizhi: function (e) {
    wx.navigateTo({
      url: '/pages/dizhi/dizhi?num='+""
    })
  },
  shoucang: function () {
    wx.navigateTo({
      url: '/pages/shouc/shouc'
    })
  },
  settings: function () {
    wx.navigateTo({
      url: '/pages/setting/index'
    })
  },
  qiandao: function (e) {
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: app.globalData.url + '/index.php/Shop/UserApi/user_sign',
      data: {
        user_token: user_token
      },
      success: res => {
        console.log(res)
        if (res.data.status == 1) {
          that.setData({
            qiandao: 1
          })
        }
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
        that.xinxi()
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
    var that=this;
    that.xinxi()
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