### 1.准备工作

#### 搭建目录结构

| 目录名     | 作用             |
| ---------- | ---------------- |
| style      | 存放公共样式     |
| components | 存放组件         |
| lib        | 存放第三方库     |
| utils      | 自己的帮助库     |
| request    | 自己的接口帮助库 |



#### 全局 app.json 修改

- 引入小程序需要开发的所有页面 "pages":[]

- 对整体的小程序风格进行设置"window":{}

  - 注意：这里的属性  "navigationBarBackgroundColor": "#eb4450" 

  - 颜色值必须使用十六进制，不然会报错

#### 全局 app.wxss

- 在Page{}中

- 定义一个变量 --themeColor作为整体的风格的颜色

-  定义一个统一的字体大小 这里统一使用rpx单位

  >  记住：假设设计稿375px
  >
  >  1px=2rpx
  >
  > 14px=28rpx 
  >
  >  font-size: 28rpx;

- 引入字体图标
  - [到阿里巴巴矢量图标库中](https://www.iconfont.cn/)
  
  - 搜索想要的图标，统一放到一个新建的项目中
  
  - ![01](https://i0.hdslb.com/bfs/album/330815c48faa1eaca6eed874214603bb7b6b2514.png)
  
  - 选择fontcss ，复制代码用浏览器打开
  
  - 复制所有内容
  
  - 在根目录下新建一个style的目录文件
  
    - 在style目录下新建一个iconfont.wxss文件  把复制的内容粘贴
  
  - 引入刚才创建好的iconfont.wxcss
  
    ```js
    @import "./style/iconfont.wxss";
    ```
  
  - "TabBar":[{}]
  
    ```js
     "TabBar":[{  
       // 字体图标颜色
        "color": "#999",
       //被选中的字体图标
        "selectedColor":"#ff2d4a",
       //tabBar的背景颜色
         "backgroundColor": "#fafafa",
       //tabBar的位置
         "position": "bottom",
       //tabBar边框颜色
         "borderStyle": "black",
       //至少要有两个！！！
         "list": [{
             {
           //页面路径（相对路径）
          "pagePath": "pages/index/index",
           //图标下面的文字内容
          "text": "首页",
           //字体图标
          "iconPath": "/icons/home.png",
           //被选中后的字体图标
          "selectedIconPath": "/icons/home-o.png"
        },
        {
          "pagePath": "pages/category/index",
          "text": "分类",
          "iconPath": "/icons/category.png",
          "selectedIconPath": "/icons/category-o.png"
        },
        {
          "pagePath": "pages/cart/index",
          "text": "购物车",
          "iconPath": "/icons/cart.png",
          "selectedIconPath": "/icons/cart-o.png"
        },
        {
          "pagePath": "pages/user/index",
          "text": "我的",
          "iconPath": "/icons/my.png",
          "selectedIconPath": "/icons/my-o.png"
        }
      ]
      }]
    }]
    ```

### 2.首页

### 业务逻辑

#### 使用自定义组件的方式 实现头部搜索框

#### 对数据请求进行封装  request

```js
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

```



#### 加载轮播图数据
- 轮播图

  - swiper标签存在默认宽度和高度 100%*150px

  - image标签也存在默认的宽度和高度 320px*240px

  - 设计图片和轮播图

  ​      先看下原图的宽高 750*340

  ​      让图片的高度自适应 宽度等于100% mode属性 widthFix

  ​      让swiper标签的高度 变成和图片一样高即可

#### 加载导航数据

#### 加载楼层数据

- css样式动态渲染

  - 使用浮动

  - 各图片布局：

  ​      第一张图片占1/3：   

  ​      原图宽度  232 * 386     232 /386 =33.33vw / height

  ​      后面四个小图片占第一张图片的1/2   33.33vw / height / 2

  ```css
  .floor_content {
        overflow: hidden;
        navigator {
          float: left;
          width: 33.33%;
          // 后四个超链接
          &:nth-last-child(-n+4) {
            // 原图的宽度232*386
            // 232/386=33.33vw/height
            // 第一张图片的高度 height:33.33vw*386/232
            width: (33.33vw * 386 / 232 / 2);
            border-left: 10rpx solid #fff;
          }
          //  2 3 两个超链接
          &:nth-child(2),
          &:nth-child(3) {
            border-bottom: 10rpx solid #fff;
          }
          image {
            width: 100%;
          }
        }
      }
  ```


#### 页面动态渲染

### 3.商品分类页面

#### 数据请求

- 使用es7的异步请求 async await 获取数据

- 对数据进行分析

- 构造左侧数据和右侧数据

- 把获取到的数据存入缓存中

- onLoad函数中，判断缓存中是否存在cates数据，

  不存在，重新发送请求

  存在并且如果获取到的系统时间Date.now()-cates.time>1000*10  重新发送时间

  否则 可以使用旧数据   获取缓存中的数据

#### 页面渲染

  - SearchInput 组件引入

  <scroll-view scroll-y></scroll-view>

  - 点击事件 同时传递 index参数 点击左侧菜单栏，根据左侧菜单index重新获取请求  ```let RightContent=this.Cates[index].children;```
### 4.商品列表

####   构造Tabs组件

- 渲染页面

- 构造从父组件传递过来的数据 tabs[]

- 监听点击事件 传递index索引

  获取到点击的索引  把点击事件发出去 ```this.triggerEvent```

  ```js
  handleItemTap(e) {
        // 获取点击的索引
        const {index}=e.currentTarget.dataset;
        // 触发父组件的事件
        this.triggerEvent("tabsItemChange",{index})
      }
  ```

#### 引入Tabs组件

- 根据需求，构造tabs数据，传递给子组件

- 监听子组件传递过来的事件

  判断点击的 index ,与tabs里面的index 修改isActive

  ```js
  tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
  ```

- <slot></slot>插槽

#### 请求商品列表数据

- 注意接口需要的参数
- 在data同级中构造QueryParams
- 使用es7异步请求  请求数据

#### 数据动态渲染

- 点击商品 item 跳转到商品详情页中  同时传递 goods_id参数

  ```url="/pages/goods_detail/index?goods_id={{item.goods_id}}"```

- 使用 block 占位符根据 index 值，替代 Tabs 组件中的插槽

#### 监听用户上拉操作onPullDownRefresh()

```js
onPullDownRefresh: function () {
     // 重置数组
     this.setData({
      goodsList:[]
    }),
    // 重置页码
    this.QueryParams.pagenum=1;
    // 重新发送请求
    this.getGoodsList()
  },
```

需要手动关闭下拉刷新窗口

```js
 wx.stopPullDownRefresh();
```

#### 监听用户下拉触底函数onReachBottom()

- 在与data 同级中设置 totalPages:1

- 在获取数据请求的过程中 计算总页数

  ```js
  //  计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
  ```

- 监听下拉触底

   ```js
    onReachBottom: function () {
    //  判断一下还有没有下一页数据
      if(this.QueryParams.pagenum>=this.totalPages) {
        // 没有下一页数据
        wx.showToast({
          title: '没有下一页数据了',
        })
      }else {
        // 还有下一页数据
        this.QueryParams.pagenum++;
        this.getGoodsList();
      }
    },

### 5.商品详情页

#### 获取详情数据

- 获取到的数据太多了，但是使用到的只占小部分
- 构造需要使用的数据 goodsObj,同时也保留获取到的完整的数据 goodsInfo

```js
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
```

#### onShow

- 从options中获取到goods_id参数

- 注意可以从onLoad中直接获取到options  但是在onShow中不能直接获取到options

  - 如何在onShow中获取到options 

  - getCurrentPages()获取页面栈函数

  - 获取当前currentPage

    ```js
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let options = currentPage.options;
    ```

#### 数据动态渲染

- css 控制文本两行显示，超过就用省略号替代

  ```css
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2
  ```

#### 监听点击事件

##### 轮播图放大效果  wx.previewImage()

```js
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
```

##### 收藏事件(需要将收藏的商品存入缓存中)

```js
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
```

##### 点击加入购物车

```js
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
```

##### 底部工具栏

客服 分享 按钮隐形,使用定位，将button按钮定位到父级元素上

使用

```
/* 完全透明 */
opacity: 0.0;
opacity: 0;
```

```css
.tool_item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 24rpx;
    position: relative;
  }

  button {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

```

点击购物车，使用navigator url跳转到购物车页面

### 6.购物车

#### onShow

```js
onShow() {
    //从缓存中获取地址和购物车数据
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart');
    this.setData({
      address,
      cart
    });
    this.setCart(cart);
  },
```

#### 页面渲染

收货地址

- 使用block占位符判断是否存在用户地址信息

- 存在则显示用户地址信息

- 不存在则显示授权按钮

购物车内容

- 使用block占位符判断cart中的长度是否不等于0
- 是 则动态渲染购物车数据
- 否 则显示一个图片

底部工具栏

- 全选按钮

  ```html
     <checkbox-group bindtap="handleItemAllCheck">
        <checkbox checked="{{allChecked}}">全选</checkbox>
      </checkbox-group>
  ```

#### 监听事件

##### 添加收货地址按钮点击事件 

- 这里有多个嵌套调用，统一封装成promise风格的异步操作  asyncWx.js
- 使用es7来调用

```js
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
      address.all = address.provinceName + address.cityName + address.countyName +        address.detailInfo;
      // 5.将收货地址存入到缓存中
      wx.setStorageSync('address', address);
    } catch (error) {
      console.log(error)
    }

  },
```

##### 底部工具栏价格数量的变化

```js
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
```

##### 商品勾选事件

```js
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
```

##### 编辑商品数量

- 需要传递过来一个operation参数 
- data-operation="{{1}}"进行商品数量加一操作
- data-operation="{{-1}}"进行商品数量减一操作

```js
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
```

##### 全选按钮

```js
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
```

##### 结算事件

```js
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
```

### 7.结算页面

#### data

```js
data: {
    address:[],
    cart:[],
    totalPrice: 0,
    totalNum: 0
  },
```

#### onShow

```js
onShow: function () {
    // 从缓存中获取到address和cart数据
   let address= wx.getStorageSync('address');
   let cart = wx.getStorageSync('cart');
   cart.filter(v=>v.checked=true);
  // 总价格和总数量
   let totalPrice=0;
   let totalNum=0;
   cart.forEach(v=>{
     totalPrice+=v.num*v.goods_price;
     totalNum+=v.num;
   })
  //  把数据设置回缓存中
  this.setData({
    cart,
    address,
    totalPrice,
    totalNum
  });
  wx.setStorageSync('cart', cart);
  },
```

#### 动态渲染数据

- 通过从缓存中获取到的address显示收货地址信息
- 对过滤到的购物车数组进行渲染（勾选了的商品）
- 底部工具栏动态渲染

#### 监听事件

```js
// 支付触发事件
async  handleOrderPay(e)
  {
    try {
      // 1.先判断有没有token值
    const token =wx.getStorageSync('token');
    // 2.判断
    if(!token)
    {
      wx.navigateTo({
        url: '/pages/quth/index',
      });
      return;
    }
    console.log("已经存在token,进行下一步操作");
    // 3.创建订单
    // 准备请求体参数
    const order_price=this.data.totalPrice;
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.goods_number,
      goods_price:v.goods_price
    }));
    const orderParams={
      order_price,
      consignee_addr,
      goods
    };
    // 准备发送请求 创建订单 获取订单编号
    const {order_number} =await request({
      url:"/my/orders/create",
      method:"post",
      data:orderParams,
    });
    // console.log(order_number);
    // 5.发起预支付接口
    const {pay} =await request({
      url:"/my/orders/req_unifiedorder",
      method:"post",
      data:{
        order_number
      }
    });
    // 6.发起微信支付
    // const res=await requestPayment(pay);
    // 7.查询后台订单状态
    // 8.删除缓存中已经支付过了的商品
    let newCart=wx.getStorageSync('cart');
    newCart=newCart.filter(v=>!v.checked);
    wx.setStorageSync('cart', newCart);
    // 支付成功后跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index?type=1',
    })
    await showToast({
      title:"支付成功"
    })
    } catch (error) {
      console.log(error);
      await showToast({
        title:"支付失败"
      });
    }
    
  }
```

### 8.用户授权界面

#### 页面渲染

```html
<button plain type="primary" bindtap="getUserProfile">点击授权</button>
```

#### data

```js
data: {
    userInfo:{}
  },
```

#### 获取用户信息 wx.getUserProfile()

- 获取用户登录的code  wx.login()异步操作

```js
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
```

### 9.订单页面

#### 引入Tabs组件

#### data

```js
data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      }
      ,{
        id:0,
        value:"待发货",
        isActive:false
      },
      {
        id:0,
        value:"退款/退货",
        isActive:false
      }
    ]
  },
```

#### onShow

```js
onShow(){
    // 判断缓存值是否存在token值
    const token=wx.getStorageSync('token');
    //不存在 则跳转到用户授权界面
    if(!token) {
      wx.navigateTo({
        url: '/pages/quth/index',
      });
      return;
    }
    //存在就获取到传递过来的options参数 type
    let pages=getCurrentPages();
    console.log(pages);
    let currentPage=pages[pages.length-1];
    console.log(currentPage);
    const {
      type
    }=currentPage.options;
    console.log(type);
    //根据type值显示标题选中状态
   this.changeTitleByIndex(type-1);
    //根据type值发送数据请求
   this.getOrders(type);
  },
```

#### 事件监听

##### 根据index值改变标题

```js
  changeTitleByIndex(index){
    const {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    });
  },
```

##### 根据激活的选中的标题索引来渲染数据

```js
handleItemChange(e)
  {
     // 获取被点击的鼠标索引
     const {
      index
    } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求
    this.getOrders(index+1);
  },
```

##### 获取订单列表

对事件戳进行转换

```js
this.setData({
      orders:res.orders.map(v=>({
        ...v,
        create_time_cn:(new Date(v.create_time*1000).toLocaleString())
      }))
    })
```

```js
 // 获取订单列表的方法
  async getOrders(type) {
    const res=await request({
      url:"/my/orders/all",
      data:{
        type
      }
    });
    this.setData({
      orders:res.orders.map(v=>({
        ...v,
        create_time_cn:(new Date(v.create_time*1000).toLocaleString())
      }))
    })
  }
```

##### 页面动态渲染

### 10.个人中心

#### data

```js
 data: {
    userInfo:{},
    collectNum:0
  },
```

#### onShow

- 从缓存中获取到用户信息和收藏数据
- 若用户并未授权登录  则需要跳转到授权页面

```js
 onShow(){
   let userInfo= wx.getStorageSync('userInfo')||[];
   let collect= wx.getStorageSync('collect')||[];
   let collectNum=collect.length;
    this.setData({
      userInfo,
      collectNum
    })
  }
```

#### 页面渲染

##### 我的订单

- 收藏的店铺 跳转到收藏页面

##### 收货地址管理

##### 应用信息管理

##### 推荐

### 11.用户登录授权

#### 页面渲染

```js
<view class="login_warp">
  <button type="primary" plain bindtap="getUserProfile" style="margin-top:40rpx">授权登录</button>
</view>
```

#### data

```js
data: {
    userInfo: {}
  },
```

#### 获取用户信息 getUserProfile

- 将用户信息存入内存
- 跳转到上一个页面 wx.navigateBack({detail:1})

```js
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
```



### 12.意见反馈页面

#### Tabs组件引入

#### data

```js
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
```

#### 页面渲染

图片上传组件UpImg

properties

```js
properties: {
    src:{
      type:String,
      value:""
    }
```

wxml

```js
view class="up_img_wrap">
  <image src="{{src}}"></image>
  <icon type="clear" size="23" color="red"></icon>
</view>
```

```js
<UpImg src="{{item}}"></UpImg>
```

#### 事件监听

##### tab点击事件

```js
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
```

##### input输入触发事件  获取输入内容 

```js
//input输入触发事件 获取输入内容 
  handleTextInput(e)
  {
    this.setData({
      textVal:e.detail.value
    })
  },
```

#####  点击 + 号触发事件   

- wx.chooseImg  选择图片

```js
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
```

##### 点击图标删除选中的图片

```js
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
```

##### 点击提交事件

```js
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
```

