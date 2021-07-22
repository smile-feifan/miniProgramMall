// 设置一个全局异步次数变量
let ajaxTimes=0;
export const request =(params)=>{
  ajaxTimes++;
  // 请求头参数
  let header={
    ...params.header
  };
  if(params.url.includes("/my/")) {
    header['Authorization']=wx.getStorageSync('token');
  }
  // 显示一个加载效果 (需要主动调用wxwx.hideLoading才能关闭提示框）
  wx.showLoading({
    title: '正在加载',
    mask:true
  })
  const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url: baseUrl+params.url,
      success:(res)=>{
        resolve(res.data.message);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        ajaxTimes--;
        // 等该页面的所有请求都结束后，关闭提示框
        if(ajaxTimes==0){
          wx.hideLoading();
        }

      }
    })
  })
}
