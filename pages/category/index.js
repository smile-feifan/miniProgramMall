import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LeftMenuList: [],
    RightContent: [],
    // 被点击的左侧菜单索引
    currentIndex: 0
  },
  // 获取到的接口数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取本地存储数据
    const Cates=wx.getStorageSync('cates');
    // 2.判断
    if(!Cates) {
      this.getCates();
    }else{
      if(Date.now()-Cates.time>1000*10) {
        // 重新发送请求
        this.getCates();
      }else{
        // 可以使用旧数据
        this.Cates=Cates.data;
        let LeftMenuList = this.Cates.map(v => v.cat_name);
        let RightContent = this.Cates[0].children;
        this.setData({
          LeftMenuList,
          RightContent
        });
      }
    } 
  },
  // 获取分类数据
  // 使用es7的async await来发送请求
  async getCates() {
    const res = await request({
      url: '/categories'
    });
    this.Cates = res;
    // 把接口数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    // 构造左侧大菜单数据
    let LeftMenuList = this.Cates.map(v => v.cat_name);
    //  构造右侧的商品数据
    let RightContent = this.Cates[0].children;
    this.setData({
      LeftMenuList,
      RightContent
    })
  },
  // 点击左侧菜单事件
  handleItemTap(e) {
    // console.log(e);
    const {
      index
    } = e.currentTarget.dataset;
    let currentIndex=index;
    let RightContent=this.Cates[index].children;
    this.setData({
      currentIndex,
      RightContent
    });
    console.log(this.currentIndex);
  }
})