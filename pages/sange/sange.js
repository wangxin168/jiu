// pages/sange/sange.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",
    name:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    that.setData({
      type:options.type,
      name:options.name
    })
    wx.setNavigationBarTitle({
      title: that.data.name//页面标题为路由参数
    })
    // 三个
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/type_list_api',
      data:{
        is_type:that.data.type
      },
      success: res => {
        console.log(res)
        that.setData({
          sange: res.data.data
        })
      }
    });
  },
  chaner: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/chaner/chaner?typeid=' + e.currentTarget.dataset.typeid + "&type=" + e.currentTarget.dataset.type + "&nochuan=" + e.currentTarget.dataset.nochuan + "&name=" + e.currentTarget.dataset.name + "&twotypeid=" + e.currentTarget.dataset.twotypeid
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