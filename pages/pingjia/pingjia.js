// pages/pingjia/pingjia.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths: [],
    goodid: "",
    orderid: "",
    value: "",
    my_text:'',
    userStars: [
      '/img/xuanzhong.png',
      '/img/weixuan.png',
      '/img/weixuan.png',
      '/img/weixuan.png',
      '/img/weixuan.png'
    ],
    index:"1",
    star_con:"太差劲了"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      goodid: options.goodid,
      orderid: options.orderid,
      type: options.type,
      goodname: options.goodname
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },
  // 星星点击事件
  starTap: function (e) {
    var that=this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = '/img/xuanzhong.png'
      } else { // 其他是空心
        tempUserStars[i] = '/img/weixuan.png'
      }
    }
    // 重新赋值就可以显示了
    this.setData({
      userStars: tempUserStars,
      // 黄色星星的长度
      index: e.currentTarget.dataset.index+1
    })
    if(that.data.index==1){
      this.setData({
        star_con:"太差劲了"
      })
    } else if (that.data.index == 2) {
      this.setData({
        star_con: "不咋地"
      })
    } else if (that.data.index == 3) {
      this.setData({
        star_con: "一般般"
      })
    } else if (that.data.index == 4) {
      this.setData({
        star_con: "挺好的"
      })
    } else if (that.data.index == 5) {
      this.setData({
        star_con: "非常好"
      })
    }
  },
  //图片上传

  up_img: function(e) {
    console.log(e)
    var that = this;
    var user_token = wx.getStorageSync('user_token')
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        // console.log(res)

        var tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths: res.tempFilePaths
        })

      }
    })
  },
  bindFormSubmit: function(e) {
    var that = this;
    console.log(that.data.ping)
    var a = this.data.tempFilePaths
    console.log(a)
    for (var i = 0; i < a.length; i++) {
      var c = a[i];
      // that.updata(c);
    }
    // updata: function(c) {
      var that = this;
      var user_token = wx.getStorageSync('user_token');
    if (e.detail.value.textarea.replace(/\s+/g, '') == "") {
      wx.showToast({
        title: "请填写评价",
        icon: "none"
      })
      return;
    } else {
      if (c == null || c == "") {
        wx.request({
          url: getApp().globalData.url + '/index.php/Shop/api/goods_comment_api',
          name: 'comment_img',
          data: {
            user_token: user_token,
            order_id: that.data.orderid,
            goods_id: that.data.goodid,
            // comment_content: that.data.my_text
            comment_content: e.detail.value.textarea,
            star_num:that.data.index
          },
          success(res) {
            console.log(res)
            wx.showToast({
              title: "评价成功",
              icon: "none"
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/shopxiang/shopxiang?goodid=' + that.data.goodid + "&type=" + that.data.type + "&goodname=" + that.data.goodname
              })
            }, 1000)
            
          }
        })
      } else {
        wx.uploadFile({
          url: getApp().globalData.url + '/index.php/Shop/api/goods_comment_api',
          filePath: c,
          name: 'comment_img',

          formData: {
            user_token: user_token,
            order_id: that.data.orderid,
            goods_id: that.data.goodid,
            // comment_content: that.data.my_text
            comment_content: e.detail.value.textarea,
            star_num: that.data.index
          },
          success(res) {
            console.log(res)
            wx.showToast({
              title: "评价成功",
              icon: "none"
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/shopxiang/shopxiang?goodid=' + that.data.goodid + "&type=" + that.data.type + "&goodname=" + that.data.goodname
              })
            }, 1000)

          }
        })
      }
    }
  },
  shanchu:function(e){
    var tempFilePaths = this.data.tempFilePaths;
    var index = e.currentTarget.dataset.index;
    tempFilePaths.splice(0);
    this.setData({
      tempFilePaths: tempFilePaths
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})