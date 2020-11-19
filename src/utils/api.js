import Taro from '@tarojs/taro'

let domain = 'http://localhost:8800'
// domain = 'http://60.205.202.39'
// domain = 'http://192.168.137.1:8800'
domain = 'http://172.16.81.191:8800'
domain = 'https://ipromiseyourlife.com'

//#### 获取食物分类
export const getFoodClass = () => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/foodClass/getClass',
      method: 'GET',
      success: function (res) {
        resolve(res.data.list)
      },
      fail: function (e) {
        console.log(e)
        Taro.showToast({
          title: JSON.stringify(e.errMsg),
          icon: 'none',
          duration: 3000
        })
        reject(e)
      }
    })
  })
}

//#### 获取食物列表
export const getFoodList = (data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/food/getList',
      method: 'GET',
      data,
      success: function (res) {
        resolve(res.data.list)
      },
      fail: function (e) {
        console.log(e)
        getErrorMsg(e)
        reject(e)
      }
    })
  })
}

//#### 获取元素所属类别
export const getElementClass = () => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/foodClass/getElementClass',
      method: 'GET',
      success: function (res) {
        resolve(res.data.list)
      },
      fail: function (e) {
        console.log(e)
        getErrorMsg(e)
        reject(e)
      }
    })
  })
}

//#### 获取元素map
export const getElement = () => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/foodClass/getElement',
      method: 'GET',
      success: function (res) {
        resolve(res.data.list)
      },
      fail: function (e) {
        console.log(e)
        getErrorMsg(e)
        reject(e)
      }
    })
  })
}

//#### 获取食物所有信息
export const getFoodInfo = (data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/food/getfoodinfo',
      method: 'GET',
      data,
      success: function (res) {
        resolve(res.data.info)
      },
      fail: function (e) {
        console.log(e)
        getErrorMsg(e)
        reject(e)
      }
    })
  })
}

const getErrorMsg = (e) => {
  return Taro.showToast({
    title: JSON.stringify(e.errMsg),
    icon: 'none',
    duration: 3000
  })
}
