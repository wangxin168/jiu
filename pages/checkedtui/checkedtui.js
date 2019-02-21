var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:"",
    order_goods_list:[],
    checked:false,
    goodlist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    that.setData({
      order_id: options.orderid
    })
    var user_token = wx.getStorageSync('user_token');
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/refund_goods_list_api',
      data: {
        user_token: user_token,
        order_id: that.data.order_id
      },
      success: function (res) {
        console.log(res)
        that.setData({
          order_goods_list: res.data.data.order_goods_list
        })
      }
    });
  
  },
  bindCheckbox: function (e) {
    console.log(e)
    var that=this
    var goodlist = that.data.goodlist
    goodlist.push(e.currentTarget.dataset.goodid)
    console.log(that.data.goodlist)
  },
  shentui:function(e){
    var that=this;
    wx.navigateTo({
      url: '/pages/tuikuan/tuikuan?arr=' + that.data.goodlist + "&orderid=" + that.data.order_id
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