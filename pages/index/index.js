import {request} from "../../request/index.js";

Page({
  data:{
    SwiperList:[],
    CatesList:[],
    FloorList:[]
  },
  // 监听页面的加载
  onLoad(){
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList();
  },
  // 请求轮播图数据
  getSwiperList(){
    request({
      url:"/home/swiperdata"
    }).then(res=>{
      this.setData({
        SwiperList:res
      })
    })
  },
  // 请求分类导航栏数据
  getCatesList(){
    request({
      url:"/home/catitems"
    }).then(res=>{
      // console.log(res);
     this.setData({
       CatesList:res
     })

    })
  },
  // 请求楼层的数据
  getFloorList(){
    request({
      url:'/home/floordata'
    }).then(res=>{
       this.setData({
        FloorList:res
       })
    })
  }

})
