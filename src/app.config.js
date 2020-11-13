export default {
  pages: [
    'pages/index/index',
    'pages/food/index',
    'pages/personal-center/index',
    // 'pages/classifyDetail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    // enablePullDownRefresh: true,
    // onReachBottomDistance: 50,
  },
  tabBar: {
    color: "#626567",
    selectedColor: "#44b9ed",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [{
      pagePath: "pages/index/index",
      text: "资讯",
      iconPath: "./image/new1.png",
      selectedIconPath: "./image/new2.png"
    }, {
      pagePath: "pages/food/index",
      text: "食材",
      iconPath: "./image/food1.png",
      selectedIconPath: "./image/food2.png"
    }, {
      pagePath: "pages/personal-center/index",
      text: "个人中心",
      iconPath: "./image/center1.png",
      selectedIconPath: "./image/center2.png"
    }]
  }
}
