export default {
  pages: [
    'pages/index/index',
    'pages/food/index',
    'pages/personal-center/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    color: "#626567",
    selectedColor: "#44b9ed",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [{
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "",
        selectedIconPath: ""
      }, {
        pagePath: "pages/food/index",
        text: "分类",
        iconPath: "",
        selectedIconPath: ""
      }, {
        pagePath: "pages/personal-center/index",
        text: "个人中心",
        iconPath: "",
        selectedIconPath: ""
      }

    ]
  }
}
