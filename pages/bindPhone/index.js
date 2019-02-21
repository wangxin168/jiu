// pages/bindPhone/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vals:"发送验证码",
    times:60
  },
  inputTel:function(e){
    this.setData({
      tels: e.detail.value
    })
  },
  sendCode: function (event) {
      let that = this
    wx.request({
      url: 'https://www.zetiansm.cn/index.php/Shop/api/send_code_api',
      data: {
        type: 5,
        mobile: that.data.tels
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res)
        if(res.data.status==1){
            wx.showToast({
              title: '验证码已发送,请在30分钟内填写',
              icon:"none"
            })
            var interva = setInterval(function(){
            that.setData({
              vals: --that.data.times+"s"
            })
          },1000)  

          setTimeout(function () {
            clearInterval(interva)
            that.setData({
              vals: "发送验证码"
            })
          }, 60100)
        }
      }
    })

  },
  formSubmit: function (e) {
    let openids = wx.getStorageSync('openids');
    let usernames = wx.getStorageSync('userNames');
    let userImgs = wx.getStorageSync('userImg')
    wx.request({
      url: 'https://www.zetiansm.cn/index.php/Shop/api/third_party_bind_api',
      data: {
        is_type:"6",
        openid: openids,
        nickname: usernames,
        head_img: userImgs,
        mobile: e.detail.value.tel,
        code: e.detail.value.code
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method:"GET",
      success(res) {
        if (res.data.status==1){
          wx.setStorageSync('user_token', res.data.data);
          wx.setStorageSync('isRegist',1);
          wx.showToast({
            title: '绑定成功',
            icon:"none"
          })
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }
    })
  }
})