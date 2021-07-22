import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    //取消按钮是否显示
    isFocus:false,
    // 输入框的值
    inputValue:""
  },
  TimeId:-1,
  handleInput(e){
    // 1.获取输入的值
    const {value}=e.detail;
    // 2.检测输入值是否合法
    if(!value.trim()){
      this.setData({
        isFocus:false
      })
    }
    // 3.准备发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
      this.qsearch(value);
    },1000);
  },
  // 获取搜索数据
  async qsearch(query) {
    const res=await request({
      url:"/goods/qsearch",
      data:{
        query
      }
    });
    this.setData({
      goods:res
    })
  },

  // 点击取消按钮事件
  handleConcel(e){
    this.setData({
      inputValue:"",
      goods:[],
      isFocus:false
    })

  }
})