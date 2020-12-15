import Taro from '@tarojs/taro'

export const alert = (msg) => {
  return Taro.showToast({
    title: msg,
    icon: 'none',
    duration: 3000
  })
}

export const getHeight = (e) => {
  return new Promise(resolve => {
    const query = Taro.createSelectorQuery()
    query.select(e).boundingClientRect(rec => {
      resolve(rec)
    }).exec();
  })
}

export const dateFormat = (d) => {
  const now = new Date(d)
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}
