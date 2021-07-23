import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      }
      ,{
        id:0,
        value:"待发货",
        isActive:false
      },
      {
        id:0,
        value:"退款/退货",
        isActive:false
      }
    ]
  },
  // 根据激活选中的标题索引来渲染数据
  changeTitleByIndex(index){
    const {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    });
  },
  handleItemChange(e)
  {
     // 获取被点击的鼠标索引
     const {
      index
    } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求
    this.getOrders(index+1);
  },
  onShow(){
    // 判断缓存值是否存在token值
    const token=wx.getStorageSync('token');
    if(!token) {
      wx.navigateTo({
        url: '/pages/quth/index',
      });
      return;
    }
    let pages=getCurrentPages();
    console.log(pages);
    let currentPage=pages[pages.length-1];
    console.log(currentPage);
    const {
      type
    }=currentPage.options;
    console.log(type);
   this.changeTitleByIndex(type-1);
   this.getOrders(type);
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res=await request({
      url:"/my/orders/all",
      data:{
        type
      }
    });
    this.setData({
      orders:res.orders.map(v=>({
        ...v,
        create_time_cn:(new Date(v.create_time*1000).toLocaleString())
      }))
    })
  }

})