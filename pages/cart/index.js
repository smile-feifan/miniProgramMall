import {
  getSetting,
  chooseAddress,
  openSetting,
  showToast,
  showModal
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow() {
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart');
    this.setData({
      address,
      cart
    });
    this.setCart(cart);
  },
  // 添加收货地址按钮点击事件
  async handleChooseAddress(e) {
    // 1.获取权限状态
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2.判断权限状态
      if (scopeAddress === false) {
        // 3.调用获取收货地址 的api
        await openSetting();
      }
      // 4.调用获取到的收货地址 api
      const address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 5.将收货地址存入到缓存中
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error)
    }

  },

  // 商品勾选事件
  handleItemChange(e)
  {
    // 1.获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id;
    // 2.获取购物车数组
    let {cart}=this.data;
    // 3.找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 4.选中状态取反
    cart[index].checked=!cart[index].checked;
   
    this.setCart(cart);
  },
  // 底部工具栏价格和数量的变化
  setCart(cart) {
    let allChecked=true;
    let totalPrice=0;
    let totalNum=0;

    cart.forEach(v=>{
      if(v.checked) {
        totalPrice+=v.num * v.goods_price;
        totalNum+=v.num;
      }else {
        allChecked=false
      }
    })
    // 判断数组是否为空
    allChecked=cart.length!=0? allChecked:false;
    // 把购物车中的数据全部设置回data和缓存中
    this.setData({
      cart,
      totalNum,
      totalPrice,
      allChecked
    });
    wx.setStorageSync('cart', cart);
  },
  // 点击编辑商品数量
  async handleItemNumEdit(e) {
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    const {
      cart
    } = this.data;
    // 找到需要修改的商品索引
    let index = cart.findIndex(v => v.goods_id === id);
    // console.log(index);
    // 判断是否需要执行修改数量
    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({
        content: "您是否要删除?"
      });
      //  console.log(res);
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 进行数量修改
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  // 全选按钮事件
  handleItemAllCheck(e)
  {
    // 1.获取data中的数据
     let {cart,allChecked}=this.data;
    //  2.修改值
    allChecked=!allChecked;
    // 循环修改cart中商品的选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 把修改后的值，填充回data中
    this.setCart(cart);
  },
  // 结算事件
 async handlePay(e){
    let {
      address,totalNum
    }=this.data;
    // 判断用户有没有选择收货地址
    if(!address.userName){
      await showToast({
         title:"您还没有选择收货地址"
       });
       return;
    }else if(totalNum===0){
      await showToast({
        title:"您还没有选购商品"
      });
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    })

  }
  
})