import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
    cart:[],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 从缓存中获取到address和cart数据
   let address= wx.getStorageSync('address');
   let cart = wx.getStorageSync('cart');
   cart.filter(v=>v.checked=true);
  // 总价格和总数量
   let totalPrice=0;
   let totalNum=0;
   cart.forEach(v=>{
     totalPrice+=v.num*v.goods_price;
     totalNum+=v.num;
   })
  //  把数据设置回缓存中
  this.setData({
    cart,
    address,
    totalPrice,
    totalNum
  });
  wx.setStorageSync('cart', cart);
  },

  // 支付触发事件
async  handleOrderPay(e)
  {
    try {
      // 1.先判断有没有token值
    const token =wx.getStorageSync('token');
    // 2.判断
    if(!token)
    {
      wx.navigateTo({
        url: '/pages/quth/index',
      });
      return;
    }
    console.log("已经存在token,进行下一步操作");
    // 3.创建订单
    // 准备请求体参数
    const order_price=this.data.totalPrice;
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.goods_number,
      goods_price:v.goods_price
    }));
    const orderParams={
      order_price,
      consignee_addr,
      goods
    };
    // 准备发送请求 创建订单 获取订单编号
    const {order_number} =await request({
      url:"/my/orders/create",
      method:"post",
      data:orderParams,
    });
    // console.log(order_number);
    // 5.发起预支付接口
    const {pay} =await request({
      url:"/my/orders/req_unifiedorder",
      method:"post",
      data:{
        order_number
      }
    });
    // 6.发起微信支付
    // const res=await requestPayment(pay);
    // 7.查询后台订单状态
    // 8.删除缓存中已经支付过了的商品
    let newCart=wx.getStorageSync('cart');
    newCart=newCart.filter(v=>!v.checked);
    wx.setStorageSync('cart', newCart);
    // 支付成功后跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index?type=1',
    })
    await showToast({
      title:"支付成功"
    })
    } catch (error) {
      console.log(error);
      await showToast({
        title:"支付失败"
      });
    }
    
  }
})