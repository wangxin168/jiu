let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['男', '女','保密'],
    tempFilePaths: null,
    index:0,
    user_sex:"",
    touxiang:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      touxiang: options.touxiang
    })

    var user_token = wx.getStorageSync('user_token')
    wx.request({
      url: app.globalData.url + '/index.php/Shop/UserApi/personal',
      data: {
        user_token: user_token
      },
      success: res => {
        if (res.data.data != null) {
          that.setData({
            zhongxin: res.data.data,
            index: Number(res.data.data.user_sex)-1
          })
        }
      }
    });
  },
  up_img: function (e) {
    var that = this;
    var user_token = wx.getStorageSync('user_token')
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        var tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths: res.tempFilePaths[0]
        })

      }
    })
  }, 
  // 普通
  bindPickerChange: function (e) {
    this.setData({
      index: parseInt(e.detail.value)
    })
  },
  updateName: function (e) {
    var that = this;
    if (that.data.tempFilePaths==null){
      wx.showToast({
        title: '请选择头像',
        icon: "none"
      })
      return false
    }
    if (e.detail.value.username.replace(/\s+/g, '')==""){
        wx.showToast({
          title: '昵称不能为空',
          icon:"none"
        })
        return false
    }
    if (e.detail.value.xingming.replace(/\s+/g, '') == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: "none"
      })
      return false
    }
    
    var user_token = wx.getStorageSync('user_token');
    wx.uploadFile({
      url: app.globalData.url + '/index.php/Shop/UserApi/save_user_info',
      filePath: that.data.tempFilePaths,
      name: 'user_head_img',
      formData: {
        user_token: user_token,
        user_nickname: e.detail.value.username,
        user_name: e.detail.value.xingming,
        user_sex: e.detail.value.sex
      },
      success(res) {
        console.log(res)
        wx.showToast({
          title: '修改成功',
          icon:"none"
        })
        that.onLoad()
        setTimeout(function(){
            wx.navigateBack({
              delta: 1,
            })
        },200)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})