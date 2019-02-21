var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    gouwu: [],
    selectedAllStatus: false,
    totalCount: "",
    totalPrice: 0,
    checked: false,
    goodArr: [],
    allChooe: false,
    num: 0,
    flag: false,
    limit: 10,
    yincang: "",
    height: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    var user_token = wx.getStorageSync('user_token');
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: 750 * res.windowHeight / res.windowWidth
        })
      }
    })

    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/car_list_api',
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
        if (res.data.data == null) {
          that.setData({
            yincang: 1
          })
          return;
        } else {
          that.setData({
            yincang: 2
          })
        }
        
        if (res.data.data != null) {
          that.setData({
            gouwu: res.data.data.car_list,
            selectedAllStatus: false,
            allChooe: false,
            num: 0,
            totalPrice: 0
          })
        } else {
          that.setData({
            gouwu: "",
            selectedAllStatus: false,
            num: 0,
            totalPrice: 0
          })
        }
      }
    });
  },
  calculateTotal: function () {
    var that = this
    var gouwu = that.data.gouwu;
    var totalCount = 0;
    var totalPrice = 0;
    if (that.data.allChooe == true) {
      for (let i = 0; i < gouwu.length; i++) {
        totalPrice += Number((gouwu[i].goods_price * gouwu[i].goods_num).toFixed(1))
      }
    } else {
      totalPrice = 0
    }
    that.setData({
      'totalCount': totalCount,
      'totalPrice': totalPrice
    })

  },
  //绑定单选
  bindCheckbox: function (e) {
    let that = this
    var nums = that.data.num
    var total = that.data.totalPrice
    var gouwu = that.data.gouwu;
    var leng = gouwu.length - 1
    var idx = e.currentTarget.dataset.index;
    if (gouwu[idx].checks == undefined || gouwu[idx].checks == false) {
      gouwu[idx].checks = true
      total += Number(gouwu[idx].goods_price) * Number(gouwu[idx].goods_num)
      that.setData({
        num: ++that.data.num
      })
    } else {
      gouwu[idx].checks = false
      total -= Number(gouwu[idx].goods_price * gouwu[idx].goods_num);
      that.setData({
        num: --that.data.num
      })
      nums -= nums
    }
    if (nums == leng) {
      that.setData({
        allChooe: true,
        selectedAllStatus: true
      })
    } else {
      that.setData({
        selectedAllStatus: false,
        allChooe: false
      })
    }
    that.setData({
      gouwu: gouwu,
      totalPrice: total
    })

  },
  //绑定多选
  bindSelectAll: function (e) {
    let that = this
    let allData = that.data.gouwu
    /**全部选状态 */
    if (that.data.allChooe == false) {
      for (let i = 0; i < allData.length; i++) {
        allData[i].checks = true
      }
      that.setData({
        allChooe: true
      })
    } else {
      for (let i = 0; i < allData.length; i++) {
        allData[i].checks = false
      }
      that.setData({
        allChooe: false
      })
    }
    that.calculateTotal()
    that.setData({
      gouwu: allData
    })
  },
  add: function (e) {
    var that = this
    let allVal = e.currentTarget.dataset
    var numPrice = Number(allVal.price)
    var index = e.currentTarget.dataset.index
    let allData = that.data.gouwu
    var total = that.data.totalPrice
    var user_token = wx.getStorageSync('user_token');
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/change_car_num_api',
      data: {
        user_token: user_token,
        goods_id: e.currentTarget.dataset.goodid,
        is_type: 1
      },
      success: res => {
        if (allData[index].checks == false || allData[index].checks == undefined) {
          allData[index].goods_num = Number(allData[index].goods_num) + 1
          that.setData({
            gouwu: allData
          })
        } else {
          allData[index].goods_num = Number(allData[index].goods_num) + 1
          total += numPrice
          that.setData({
            gouwu: allData,
            totalPrice: total
          })
        }
      }
    });
  },
  // 删除
  del: function () {
    var that = this
    var allData = that.data.gouwu
    var arrs = []
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].checks == true) {
        arrs.push(allData[i].car_id)
      }
    }
    if (arrs == "") {
      wx.showToast({
        title: '请先选择要删除的商品',
        icon: "none"
      })
      return false
    }
    that.setData({
      delete: 1
    })
  },
  shan: function (e) {
    console.log(111)
    var that = this
    var user_token = wx.getStorageSync('user_token');
    var allData = that.data.gouwu
    var arrs = []
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].checks == true) {
        arrs.push(allData[i].car_id)
      }
    }
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/car_delete_api',
      data: {
        user_token: user_token,
        car_id_arr: arrs
      },
      success: res => {
        that.onShow()
        if (that.data.selectedAllStatus == true) {
          that.setData({
            selectedAllStatus: false
          })
        }
        that.setData({
          totalPrice: 0,
          num: 0,
          delete: 2
        })

      }
    })
  },
  qvxiao: function () {
    var that = this;
    that.setData({
      delete: 2
    })
  },
  jian: function (e) {
    var that = this
    var priceNum = e.currentTarget.dataset.price
    var index = e.currentTarget.dataset.index
    var allData = that.data.gouwu
    var total = that.data.totalPrice
    var user_token = wx.getStorageSync('user_token');
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/change_car_num_api',
      data: {
        user_token: user_token,
        goods_id: e.currentTarget.dataset.goodid,
        is_type: 2
      },
      success: res => {
        if (allData[index].checks == false || allData[index].checks == undefined) {
          if (allData[index].goods_num <= 1) {
            return false
          } else {
            allData[index].goods_num = allData[index].goods_num - 1
            that.setData({
              gouwu: allData
            })
          }
        } else {
          if (allData[index].goods_num <= 1) {
            wx.showToast({
              title: '数量不能小于1',
              icon: "none"
            })
            return false
          } else {
            if (total <= 0) {
              return false
            }
            allData[index].goods_num = allData[index].goods_num - 1
            console.log(that.data.totalPrice)
            that.setData({
              gouwu: allData,
              totalPrice: that.data.totalPrice - priceNum
            })
          }
        }
      }
    });
  },
  /**
   * 结算
   */
  jiesuan: function () {
    var that = this
    let allData = that.data.gouwu
    var arrays = []
    for (let i = 0; i < allData.length; i++) {
      if (allData[i].checks == true) {
        arrays.push(allData[i].car_id)
      }
    }
    if (arrays == "") {
      wx.showToast({
        title: '请先选择商品',
        icon: "none"
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/carOrder/index?ways=1' + "&goodid=" + arrays + "&priceTotal=" + that.data.totalPrice
    })
  },
  onTabItemTap: function (e) {
    let isRegst = wx.getStorageSync('isRegist');
    if (isRegst == 2) {
      wx.redirectTo({
        url: '/pages/bindPhone/index',
      })
    }
  },
  /**上拉加载更多 */
  // onReachBottom:function(){
  //   var that = this
  //   var user_token = wx.getStorageSync('user_token');
  //   wx.request({
  //     url: app.globalData.url + '/index.php/Shop/api/car_list_api',
  //     data: {
  //       user_token: user_token
  //     },
  //     success: res => {
  //       if (res.data.data != null) {
  //         that.setData({
  //           gouwu: res.data.data.car_list,
  //           selectedAllStatus: false,
  //           allChooe: false,
  //           num: 0,
  //           totalPrice: 0
  //         })
  //       } else {
  //         that.setData({
  //           gouwu: "",
  //           selectedAllStatus: false,
  //           num: 0,
  //           totalPrice: 0
  //         })
  //       }
  //     }
  //   });

  // }
})