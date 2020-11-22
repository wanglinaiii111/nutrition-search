import Taro from '@tarojs/taro'

export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    Taro.getUserInfo({
      success: (res) => {
        resolve(res.userInfo)
      }
    })
  })
}

export const getSystemInfo = () => {
  return new Promise((resolve, reject) => {
    Taro.getSystemInfo({
      success: res => {
        resolve(res)
      }
    })
  })
}
export const taroLogin = () => {
  return new Promise((resolve, reject) => {
    Taro.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          resolve(res)
        } else {
          reject(res.errMsg)
        }
      }
    })
  })
}
