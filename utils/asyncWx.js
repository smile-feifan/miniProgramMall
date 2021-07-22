// promise形式的 getSetting
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

// promise 形式的chooseAddress
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

// promise 形式的openSetting
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

// promise 形式的弹窗提示
// param title参数
export const showToast = ({
  title
}) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

// promise 形式的删除操作提示
// param content
export const showModal = ({
  content
}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content:content,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}

// promise 形式的login
export const login = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success:(res)=>{
        resolve(res);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}

// promise 形式的login
export const requestPayment = (pay) => {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...pay
    });
    success: (res) => {
      resolve(res);
    };
    fail: (err) => {
      reject(err);
    }
  })
}