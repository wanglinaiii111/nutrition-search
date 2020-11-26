export default {
  pages: [
    // 'pages/index/index',
    'pages/food/index',
    'pages/personal-center/index',
    'pages/classifyDetail/index',
    'pages/compare/index'
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
        pagePath: "pages/food/index",
        text: "食材",
        iconPath: "./image/food1.png",
        selectedIconPath: "./image/food2.png"
      },
      // {
      //   pagePath: "pages/index/index",
      //   text: "工具",
      //   iconPath: "./image/vs1.png",
      //   selectedIconPath: "./image/vs2.png"
      // },
      {
        pagePath: "pages/personal-center/index",
        text: "个人中心",
        iconPath: "./image/center1.png",
        selectedIconPath: "./image/center2.png"
      }
    ]
  }
}
