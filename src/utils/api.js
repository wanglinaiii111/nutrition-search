import Taro from '@tarojs/taro'
import {
  CONFIG
} from './config'
import {
  alert
} from './util'
const domain = CONFIG.domain

//#### 获取食物分类
export const getFoodClass = () => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/foodClass/getClass',
      method: 'GET',
      success: function (res) {
        console.log(res)
        resolve(res.data.list)
      },
      fail: function (e) {
        console.log(e)
        alert(e.errMsg)
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
        alert(e.errMsg)
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
        alert(e.errMsg)
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
        alert(e.errMsg)
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
        alert(e.errMsg)
        reject(e)
      }
    })
  })
}

//#### 登录
export const login = (data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/user/login',
      method: 'post',
      retryTimes: 0,
      data,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (e) {
        alert(e.errMsg)
        reject(e)
      }
    })
  })
}

//#### 收藏
export const setCollectFood = (data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/food/collectFood',
      method: 'GET',
      data,
      success: function (res) {
        alert('收藏成功')
        resolve(res)
      },
      fail: function (e) {
        console.log(e)
        alert(e.errMsg)
        reject(e)
      }
    })
  })
}

//#### 取消收藏
export const setUnCollectFood = (data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/food/unCollectFood',
      method: 'GET',
      data,
      success: function (res) {
        alert('取消收藏')
        resolve(res)
      },
      fail: function (e) {
        console.log(e)
        alert(e.errMsg)
        reject(e)
      }
    })
  })
}

//#### 根据code获取该类别的所有食材
export const getFoodAllList = (data) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: domain + '/food/getfoodAllList',
      method: 'GET',
      data,
      success: function (res) {
        resolve(res.data.list)
      },
      fail: function (e) {
        console.log(e)
        alert(e.errMsg)
        reject(e)
      }
    })
  })
}
