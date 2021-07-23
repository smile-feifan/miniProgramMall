import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  totalPages:1,
  handleTabsItemChange(e) {
    // 获取被点击的鼠标索引
    const {
      index
    } = e.detail;
    //  修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 获取商品列表数据
 async getGoodsList() {
   const res=await request({
     url:'/goods/search',
     data:this.QueryParams
   });
   const total=res.total;
  //  计算总页数
  this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
  this.setData({
    goodsList:[...this.data.goodsList,...res.goods]
  })
  // 关闭下拉刷新的窗口 如果没有调用 下拉加载刷新窗口 直接关闭也不会报错
  wx.stopPullDownRefresh();
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.getGoodsList();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     // 重置数组
     this.setData({
      goodsList:[]
    }),
    // 重置页码
    this.QueryParams.pagenum=1;
    // 重新发送请求
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  //  判断一下还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据了',
      })
    }else {
      // 还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})