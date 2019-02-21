let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
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
            console.log(res.data, "灌酒打印")
            if (res.data.status == 1) {
              wx.setStorageSync('openids', res.data.data.openid);
              wx.setStorageSync('user_token', res.data.data.user_token);
              wx.setStorageSync('isRegist', res.data.data.is_register);
            }
            if (res.data.data.is_register == 1) {
              wx.switchTab({
                url: '/pages/index/index',
              })
              // wx.navigateBack()
            }
          }
        })
      }
    })
  },
  onGotUserInfo: function (event) {
    let allDatas = event.detail.userInfo
    wx.setStorageSync('userImg', allDatas.avatarUrl);
    wx.setStorageSync('userNames', allDatas.nickName);
    if (wx.getStorageSync('is_register') == 1) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else {
      // return;
      wx.request({
        url: getApp().globalData.url + '/index.php/Shop/api/xcx_register_api',
        data: {
          openid: wx.getStorageSync('openids'),
          nickname: allDatas.nickName,
          head_img: allDatas.avatarUrl
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res)
          if (res.data.status == 1) {
            wx.setStorageSync('user_token', res.data.data);
            wx.setStorageSync('isRegist', 1);
            wx.switchTab({
              url: '/pages/index/index'
            })
          }else{
            wx.showToast({
              title: res.data.message,
              icon:"none"
            })
          }
        }
      })
    }



  }
})