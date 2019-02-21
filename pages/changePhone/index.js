var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  formSubmit: function (e) {
    let that = this
    var vals = e.detail.value
    var user_token = wx.getStorageSync('user_token')
    if (e.detail.value.tel == ""){
        wx.showToast({
          title: '手机号不能为空',
          icon:"none"
        })
        return false
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
    wx.request({
      url: app.globalData.url + '/index.php/Shop/UserApi/change_bind_api',
      data: {
        user_token: user_token,
        is_type: 1,
        mobile: vals.tel,
        password: vals.pass
      },
      success: res => {
        if (res.data.status==1){
           wx.navigateTo({
             url: '/pages/surePhone/index'
           })
        }else{
          wx.showToast({
            title: res.data.message,
            icon: "none"
          })
        }
        
      }
    });
  }
})