import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  login
} from "../../utils/asyncWx.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

 async getUserProfile(e)
  {
   try {
      // 1.获取用户信息
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success:(res)=>{
        this.setData({
          userInfo:res.userInfo
        })
      }
    });
    // 2.获取小程序登录成功后的code
    const {code}=await login();
    // 3.获取token
    const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
    // 4.把token存入缓存中 同时跳转到上一个界面
    wx.setStorageSync('token', token);
    wx.navigateTo({
      url: '/pages/pay/index',
    })
   
   } catch (error) {
     console.log(error);
   }
  } 
})