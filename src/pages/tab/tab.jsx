import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View } from '@tarojs/components'

import { setPage } from '../../actions/tab'

import $icon from '../../iconfont/iconfont.scss'
import styles from './tab.scss'

const pageArr = [{
  name: '推荐',
  status: 'recommend',
  iconName: 'iconrementuijian'
}, {
  name: '食物分类',
  status: 'food',
  iconName: 'iconshiwu-'
}, {
  name: '个人中心',
  status: 'personal-center',
  iconName: 'icongerenzhongxin'
}]

const Tab = (props) => {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.tab.page);
  console.log(page)
  const handleClick = (page) => {
    return () => {
      dispatch(setPage(page))
    }
  }

  return (
    <View className={styles.container}>
      {
        pageArr.map((item) => {
          return <View className={page === item.status && `${styles.tabItemActive}`} onClick={handleClick(item.status)} key={item.status}>
            <View className={`${styles.myIcon} ${$icon.iconfont} ${$icon[item.iconName]}`}></View>
            {item.name}
          </View>
        })
      }
    </View>
  )
}


export default React.memo(Tab);