let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    typeid: "",
    type: "",
    chaner: {},
    twotypeid: "",
    nochuan: "",
    leibie: [],
    allcate: false,
    cateid: -1,
    scale: -1,
    volums: false,
    pric: -1,
    priSort: false,
    name:"",
    limit:10,
    sales:"",
    pricesort:"",
    categray:"全部"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    // if (options.twotypeid!=undefined){
    //    that.setData({
    //      twotypeid: options.twotypeid
    //    })
    // }
    that.setData({
      typeid: options.typeid,
      type: options.type,
      nochuan: options.nochuan,
      name:options.name,
      twotypeid: options.twotypeid
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/type_goods_list_api',
      data: {
        is_type: options.type,
        one_type_id: options.typeid,
        two_type_id: options.twotypeid,
        price_sort: that.data.pricesort,
        sales_sort: that.data.sales,
        page_start:0,
        page_end: that.data.limit
      },
      success: res => {
        // console.log(res.data.data.goods_list[1].is_type)
        // for (var i = 0; i < res.data.data.goods_list.length;i++){
        //   that.setData({
        //     type: res.data.data.goods_list[i].is_type
        //   })
        // }
        that.setData({
          chaner: res.data.data.goods_list,
          leibie: res.data.data.sort_type_list
        })
      }
    });
  },
  quanbu:function(){
      var that = this
    that.setData({
      categray:"全部"
    })
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/type_goods_list_api',
        data: {
          is_type: that.data.type,
          one_type_id: that.data.typeid,
          page_start: 0,
          page_end: that.data.limit
        },
        success: res => {
          // for (var i = 0; i < res.data.data.goods_list.length; i++) {
          //   that.setData({
          //     type: res.data.data.goods_list[i].is_type
          //   })
          // }
          that.setData({
            chaner: res.data.data.goods_list,
            leibie: res.data.data.sort_type_list,
            cateid:-1,
            twotypeid:"",
            sales:"",
            scale: 1,
            pric: 1
          })
        }
      });
  },
  quaner: function (e) {
    var that = this
    that.setData({
      categray: e.currentTarget.dataset.cate
    })
    // 产品二级
    wx.request({
      url: getApp().globalData.url + '/index.php/Shop/api/type_goods_list_api',
      data: {
        is_type: that.data.type,
        one_type_id: that.data.typeid,
        two_type_id: e.target.dataset.twotypeid,
        sales_sort: that.data.sales,
        price_sort: that.data.pricesort
      },
      success: res => {
        that.setData({
          chaner: res.data.data.goods_list,
          cateid: e.currentTarget.dataset.allid,
          twotypeid: e.target.dataset.twotypeid
        })
      }
    });
  },
  dianJi: function (e) {
    this.setData({
      allcate: !this.data.allcate
    })
  },
  shopxiang: function (e) {
    wx.navigateTo({
      url: '/pages/shopxiang/shopxiang?goodid=' + e.currentTarget.dataset.goodid + "&type=" + e.currentTarget.dataset.type + "&goodname=" + e.currentTarget.dataset.goodname
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      var that = this
      wx.showLoading({
        title: '正在刷新'
      })
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/type_goods_list_api',
      data: {
        is_type: that.data.type,
        one_type_id: that.data.typeid,
        two_type_id: that.data.twotypeid,
        page_start: 0,
        page_end: that.data.limit
      },
      success: res => {
          // for (var i = 0; i < res.data.data.goods_list.length; i++) {
          //   that.setData({
          //     type: res.data.data.goods_list[i].is_type
          //   })
          // }
          that.setData({
            chaner: res.data.data.goods_list,
            leibie: res.data.data.sort_type_list,
            scale:-1,
            pric:-1,
            pricesort: "",
            sales: ""
          })
        setTimeout(function () {
          wx.hideLoading();
        }, 2000)
        wx.stopPullDownRefresh();
      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      var that = this
    var allGoods = that.data.chaner
      that.setData({
        limit: that.data.limit +10
      })
      wx.showLoading({
        title: '正在加载中'
      })
    console.log(that.data.type)
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/type_goods_list_api',
        data: {
          is_type: that.data.type,
          one_type_id: that.data.typeid,
          two_type_id: that.data.twotypeid,
          page_start: 0,
          page_end: that.data.limit,
          sales_sort: that.data.sales,
          price_sort: that.data.pricesort
        },
        success: res => {
          if (allGoods.length == res.data.data.goods_list.length){
              wx.showToast({
                title: '没有更多数据了',
                icon:"none"
              })
          }else{
              for (var i = 0; i < res.data.data.goods_list.length; i++) {
                that.setData({
                  type: res.data.data.goods_list[i].is_type
                })
              }
              that.setData({
                chaner: res.data.data.goods_list,
                leibie: res.data.data.sort_type_list
              })
          }
          setTimeout(function(){
            wx.hideLoading();
          },2000)
        }
      });
  },
  /**销量 */
  saleVolum: function () {
    let that = this
    if (that.data.volums == false) {
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/type_goods_list_api',
        data: {
          is_type: that.data.type,
          one_type_id: that.data.typeid,
          two_type_id: that.data.twotypeid,
          price_sort: that.data.pricesort,
          sales_sort: "asc"
        },
        success: res => {
          that.setData({
            chaner: res.data.data.goods_list,
            scale: 2,
            volums: true,
            sales: "asc",
            pricesort:"",
            pric:-1
          })
        }
      });
    } else {
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/type_goods_list_api',
        data: {
          is_type: that.data.type,
          one_type_id: that.data.typeid,
          two_type_id: that.data.twotypeid,
          price_sort: that.data.pricesort,
          sales_sort: "desc"
        },
        success: res => {
          that.setData({
            chaner: res.data.data.goods_list,
            scale: 1,
            volums: false,
            sales: "desc",
            pricesort:"",
            pric:-1
          })
        }
      });
    }
  },
  /**价格 */
  pricesort: function () {
    let that = this
    if (that.data.priSort == false) {
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/type_goods_list_api',
        data: {
          is_type: that.data.type,
          one_type_id: that.data.typeid,
          two_type_id: that.data.twotypeid,
          price_sort: "desc"
        },
        success: res => {
          that.setData({
            chaner: res.data.data.goods_list,
            pric: 1,
            priSort: true,
            pricesort: "desc",
            scale:-1,
            sales_sort:""
          })
        }
      });
    } else {
      wx.request({
        url: app.globalData.url + '/index.php/Shop/api/type_goods_list_api',
        data: {
          is_type: that.data.type,
          one_type_id: that.data.typeid,
          two_type_id: that.data.twotypeid,
          price_sort: "asc"
        },
        success: res => {
          that.setData({
            chaner: res.data.data.goods_list,
            pric: 2,
            priSort: false,
            pricesort: "asc",
            scale: -1,
            sales_sort:""
          })
        }
      });
    }
  }
})