// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品商家投诉",
        isActive:false
      } 
    ],
    textVal:'',
    // 被选中的 图片路径 数组
    chooseImgs:[]
  },
  // tab点击事件
  handleItemChange(e)
  {
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    this.setData({
      tabs
    })
  },
  //input输入触发事件 获取输入内容 
  handleTextInput(e)
  {
    this.setData({
      textVal:e.detail.value
    })
  },
  // 点击 + 号触发事件
  handleChooseImg(e){
    wx.chooseImage({
      // 同时选中的图片数量
      count: 9,
      // 图片的格式
      sizeType:['original','compressed'],
      // 图片来源 原图 压缩
      sourceType:['album','camera'],
      success:(res)=>{
        this.setData({
          chooseImgs:[...this.data.chooseImgs, ...res.tempFilePaths]
          // chooseImg:res.temFilePaths
        })
        console.log(res);
      }
    })
  },
  // 点击图标删除选中的图片
  handleRemoveImg(e)
  {
    const {index}=e.currentTarget.dataset;
    const {chooseImgs}=this.data;
    // console.log(index);
    chooseImgs.splice(index,1); 
    this.setData({
      chooseImgs
    })
  },
  //  点击提交事件
  handleFormSub(e){
    let {chooseImgs,textVal}=this.data;
    // 判断输入是否合法
    if(!textVal.trim())
    {
      wx.showToast({
        title: '请输入内容或提交图片',
        icon:'none',
        mask:true
      });
      return;
    }
    // 准备上传图片到专门的图片服务器
    wx.showToast({
      title: '正在等待',
      mask:true
    });
    chooseImgs.forEach((v,i)=>{
      wx.uploadFile({
        filePath: 'v',
        name: 'file',
        url: 'https://imgurl.org',
        success:(res)=>{
          console.log(res);
          wx.navigateBack({
            detail:1
          })
        },
        fail:(err)=>{
          console.log(err);
          wx.navigateBack({
            detail:1
          })
        }
      })
    })
  }
})