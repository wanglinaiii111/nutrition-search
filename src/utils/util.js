import Taro from '@tarojs/taro'

export const alert = (msg) => {
  return Taro.showToast({
    title: msg,
    icon: 'none',
    duration: 3000
  })
}
