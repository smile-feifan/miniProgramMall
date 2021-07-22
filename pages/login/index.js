// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '获取用户信息',
      success: (res) => {
        let {userInfo}=res;
        // 把获取到的用户信息存入缓存中
        wx.setStorageSync('userInfo', userInfo);
        wx.navigateBack({
          detail:1
        })
      },
      fail: (err) => {
        console.log(err);
      }
    })
  }
 
})