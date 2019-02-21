// pages/dizhi/dizhi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
    goodid:"",
    num:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      goodid: options.goodid,
      num: options.num
    })
  },
  xuanran:function(){
    var that = this
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/get_address',
      data: {
        user_token: user_token
      },
      success: res => {
        that.setData({
          address: res.data.data
        })
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    });
  },
  shanchu: function (e) {
    var that = this
    var user_token = wx.getStorageSync('user_token');
    wx.showModal({
      title: '提示',
      content: '确定要删除',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + '/index.php/Shop/UserApi/del_address',
            data: {
              user_token: user_token,
              address_id: e.currentTarget.dataset.addressid
            },
            success: res => {
              wx.showToast({
                title: res.data.message,
                icon: "none"
              })
              that.xuanran();
            }
          });
        } else if (res.cancel) {
        }
      }
    })    
  },
  bianji:function(e){
    wx.navigateTo({
      url: '/pages/bianji/bianji?addressid=' + e.currentTarget.dataset.addressid
    })
  },
  addxin:function(e){
    wx.navigateTo({
      url: '/pages/addxin/addxin'
    })
  },
  chuancan:function(e){
    var that=this
    
    var shuzu = JSON.stringify(that.data.address[e.currentTarget.dataset.id])
    
    // 杨邓  这块的注释不要删啊  有用

    // wx.navigateTo({
    //   url: '/pages/queding/queding?shuzu=' + shuzu + "&goodid=" + that.data.goodid + "&num=" + that.data.num + "&addresslength=" + that.data.address.length
    // })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    wx.navigateBack();
    prevPage.setData({
      shuzu: shuzu,
      goodid: that.data.goodid,
      num: that.data.num,
      addresslength: that.data.address.length
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
    var that=this
    that.xuanran();
  }
})