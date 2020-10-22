import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View } from '@tarojs/components'

import { setPage } from '../../actions/tab'

import './tab.scss'

const pageArr = [{
  name: '推荐',
  status: 'recommend'
}, {
  name: '食物分类',
  status: 'food'
}, {
  name: '个人中心',
  status: 'personal-center'
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
    <View class='container'>
      {
        pageArr.map((item) => {
        return <View class={page === item.status && 'tabItemActive'} onClick={handleClick(item.status)} key={item.status}>{item.name}</View>
        })
      }
    </View>
  )
}


export default React.memo(Tab);