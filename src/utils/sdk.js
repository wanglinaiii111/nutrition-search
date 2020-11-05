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
