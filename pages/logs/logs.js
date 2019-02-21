var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chanpin:"",
    chaner: "",
    index: 0,
    change: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // if (that.data.chanpin == "" && that.data.chaner==""){
    //     wx.showLoading({
    //       title: '正在加载中',
    //     })
    // }
    // 分类列表
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/classify_api',
      success: res => {
        console.log(res)
        that.setData({
          chanpin: res.data.data,
          goodslist: res.data.data[0]
        })

        // 产品二级 第一个
        wx.request({
          url: app.globalData.url + '/index.php/Shop/api/all_type_list_api',
          data: {
            one_type_id: res.data.data[0].type_id
          },
          success: res => {
            that.setData({
              chaner: res.data.data
            })
          }
        });
      }
    });

    


  },
  xuan: function (e) {
    var that = this
    // 产品二级
    wx.request({
      url: app.globalData.url + '/index.php/Shop/api/all_type_list_api',
      data: {
        one_type_id: e.currentTarget.dataset.typeid
      },
      success: res => {
        console.log(res)
        if (res.data.data==null){
           that.setData({
             chaner:true,
             change: e.currentTarget.dataset.index,
             
           })
          wx.showToast({
            title: "该分类下无商品",
            icon: "none"
          })
        }else{
          that.setData({
            chaner: res.data.data,
            change: e.currentTarget.dataset.index
          })
        }
          
      }
    });

  },
  chaner: function (e) {
    wx.navigateTo({
      url: '/pages/chaner/chaner?typeid=' + e.currentTarget.dataset.typeid + "&type=" + e.currentTarget.dataset.type + "&twotypeid=" + e.currentTarget.dataset.twotypeid + "&nochuan=" + e.currentTarget.dataset.nochuan+"&name=" + e.currentTarget.dataset.name
    })
  },
  // onReady:function(){
  //    setTimeout(function(){
  //        wx.hideLoading();
  //    },2000)
  // }
})