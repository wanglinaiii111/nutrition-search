import Taro from '@tarojs/taro'

const domain = 'http://localhost:8800'

//#### 获取食物分类
export const getFoodClass = () => {
  return new Promise((resolve) => {
    Taro.request({
      url: domain + '/foodClass/getClass',
      method: 'GET',
      success: function (res) {
        resolve(res.data.list)
      }
    })
  })
}

//#### 获取食物列表
export const getFoodList = (data) => {
  return new Promise((resolve) => {
    Taro.request({
      url: domain + '/food/getList',
      method: 'GET',
      data,
      success: function (res) {
        resolve(res.data.list)
      }
    })
  })
}

//#### 获取元素所属类别
export const getElementClass = () => {
  return new Promise((resolve) => {
    Taro.request({
      url: domain + '/foodClass/getElementClass',
      method: 'GET',
      success: function (res) {
        resolve(res.data.list)
      }
    })
  })
}

//#### 获取元素map
export const getElement = () => {
  return new Promise((resolve) => {
    Taro.request({
      url: domain + '/foodClass/getElement',
      method: 'GET',
      success: function (res) {
        resolve(res.data.list)
      }
    })
  })
}

//#### 获取食物所有信息
export const getFoodInfo = (data) => {
  return new Promise((resolve) => {
    Taro.request({
      url: domain + '/food/getfoodinfo',
      method: 'GET',
      data,
      success: function (res) {
        resolve(res.data.info)
      }
    })
  })
}
