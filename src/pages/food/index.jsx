import React, { useEffect, useState } from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'

import { AtTabs, AtTabsPane } from 'taro-ui'
import styles from './index.scss'
import { ListItem } from './listItem/listItem'

const tabList = [
  {
    title: '蔬菜',
    list: [{ name: '菠菜菠菜菠菜菠菜菠菜菠菜菠菜菠菜菠', content: { '钠': '20g', '镁': '20mg', '铁': '20KJ', '钠1': '20%' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } },
    { name: '菜花', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }]
  },
  {
    title: '水果',
    list: [{ name: '苹果', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }]
  },
  { title: '豆制品', list: [{ name: '豆浆', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '肉类', list: [{ name: '牛肉', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '油盐酱醋', list: [{ name: '盐', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '粮油', list: [{ name: '小麦', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] }
]

const scrollStyle = {
  height: '150px'
}

const Food = (props) => {
  const [current, setCurrent] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(0);
  const handleClick = (current) => {
    setCurrent(current)
  }

  useEffect(() => {
    Taro.getSystemInfo({
      success: res => {
        setScrollHeight(res.windowHeight - 35)
      }
    })
  }, [])

  return (
    <View className={styles.index}>
      <AtTabs
        current={current}
        scroll
        tabList={tabList}
        onClick={handleClick}>
        
          {
            tabList.map((item, index) => {
              return <AtTabsPane current={current} index={index}>
                <ScrollView scroll-y style={{ height: `${scrollHeight}px` }}>
                <View className={styles.tabs}>
                  {
                    item.list.map((listItem) => {
                      return <ListItem data={listItem}></ListItem>
                    })
                  }
                </View>
                </ScrollView>
              </AtTabsPane>
            })
          }
        
      </AtTabs>
    </View>
  )
}

export default React.memo(Food);

