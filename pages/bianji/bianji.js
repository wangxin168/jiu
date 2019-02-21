// pages/addxin/addxin.js
var model = require('../../model/model.js')

var show = false;
var item = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: true,
    is_default: "",
    item: {
      show: show
    },
    province: "",
    city: "",
    county: "",
    addressid:"",
    xiugai:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      addressid: options.addressid
    })
    that.xuanran()
  },
  xuanran:function(){
    var that = this;
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/get_address_details',
      data: {
        user_token: user_token,
        address_id: that.data.addressid
      },
      success: function (res) {
        that.setData({
          xiugai:res.data.data,
          is_default: res.data.data.is_default,
          province: res.data.data.province_val,
          city: res.data.data.city_val,
          county: res.data.data.district_val
        })
        if (that.data.is_default == 1) {
          that.setData({
            checked: true
          })
        } else {
          that.setData({
            checked: false
          })
        }
      }
    });
  },
  bindCheckbox: function (e) {
    var that = this
    var checked = that.data.checked
    that.setData({
      checked: !checked
    })
  },
  updateName: function (e) {
    let that = this
    if (that.data.checked== true) {
      that.setData({
        is_default : 1
      })
    } else {
      that.setData({
        is_default: 0
      })
    }
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(e.detail.value.tel)) {
      wx.showToast({
        title: '手机号格式不对',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/UserApi/save_address',
      data: {
        user_token: user_token,
        address_id: that.data.addressid,
        user_name: e.detail.value.username,
        user_mobile: e.detail.value.tel,
        province_val: that.data.province,
        city_val: that.data.city,
        district_val: that.data.county,
        user_address: e.detail.value.address,
        is_default: that.data.is_default
      },
      success: function (res) {
        console.log(res)
        wx.navigateBack({     //返回上一页面
          delta: 1,
        })
        if (res.data.data == null) {
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
          return false
        } else {
          that.setData({
            // jilu: res.data.data.welfare_card
          })
        }
        
      },
      fail: function (res) {
        console.log(222)
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    console.log("id = " + e.target.dataset.id)
    model.animationEvents(this, 200, false, 400);
    //点击确定按钮更新数据(id=444是背后透明蒙版 id=555是取消按钮)
    if (e.target.dataset.id == 666) {
      this.updateShowData()
    }
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    //如果想滑动的时候不实时更新，只点确定的时候更新，注释掉下面这行代码即可。
    this.updateShowData()
  },
  //更新顶部展示的数据
  updateShowData: function (e) {
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  }
  ,
  onReachBottom: function () {
  },
  nono: function () { },
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