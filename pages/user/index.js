// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    collectNum:0
  },
  onShow(){
   let userInfo= wx.getStorageSync('userInfo')||[];
   let collect= wx.getStorageSync('collect')||[];
    let collectNum=collect.length;
    this.setData({
      userInfo,
      collectNum
    })
  }
})