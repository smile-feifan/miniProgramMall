import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },
  goodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {
      goods_id
    } = options;
    this.getGoodsDetail(goods_id);
  },
  // 获取详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    });
    this.goodsInfo = goodsObj;
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      }
    })
  },
  // 轮播图放大效果
  handlePreviewImg(e)
  {
    // console.log(e);
    // 1.先构造要预览的图片数组
    const urls=this.goodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    // 2.接收传递过来的url
    wx.previewImage({
      showmenu:true,
      current:current,//当前显示图片 http链接
      urls: urls  //需要预览的图片http链接列表
    })
  },
  // 收藏事件
  handleCollect(e) {
    let isCollect = false;
    // 1.获取缓存中的商品收藏
    let collect = wx.getStorageSync('collect') || [];
    // 2.判断商品是否收藏过
    let index = collect.findIndex(v => v.goods_id === this.goodsInfo.goods_id)
    // 3.当index!=-1时，表示已经收藏过了
    if (index !== -1) {
      // 从数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      })
    } else {
      // 没有收藏过
      collect.push(this.goodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    // 4.把数组存入缓存中
    wx.setStorageSync('collect', collect);
    // 5.修改data中的属性 isCollect
    this.setData({
      isCollect
    })

  },
  // 点击加入购物车
  handleCartAdd(e) {
    // 1.获取缓存中的购物车数组
    let cart = wx.getStorageSync('cart') || [];
    // 2.判断商品数组是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id);
    // 3.如果index===-1则表示不在数组中
    if (index === -1) {
      this.goodsInfo.num = 1;
      this.goodsInfo.checked = true;
      cart.push(this.goodsInfo);
    } else {
      cart[index].num++;
    }
    // 4.把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    // 5.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon:'success',
      mask:true
    })
  }



})