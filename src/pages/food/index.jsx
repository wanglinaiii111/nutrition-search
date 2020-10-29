import React, { useState } from 'react'
import { View } from '@tarojs/components'

import { AtTabs, AtTabsPane } from 'taro-ui'
import styles from './index.scss'

const tabList = [
  { title: '蔬菜', list: [{ name: '菠菜', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '水果', list: [{ name: '苹果', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '豆制品', list: [{ name: '豆浆', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '肉类', list: [{ name: '牛肉', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '油盐酱醋', list: [{ name: '盐', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] },
  { title: '粮油', list: [{ name: '小麦', content: { '钠': '20毫克', '镁': '20毫克', '铁': '20毫克' } }] }
]

const Food = (props) => {
  const [current, setCurrent] = useState(0)
  const handleClick = (current) => {
    setCurrent(current)
  }
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
              {
                item.list.map((listItem) => {
                  return <View className={styles.listItem}>{listItem.name}{
                    Object.keys(listItem.content).map(contentItem => {
                      return <View>{contentItem + ":" + listItem.content[contentItem]}</View>
                    })
                  }</View>
                })
              }
            </AtTabsPane>
          })
        }
      </AtTabs>
    </View>
  )
}


export default React.memo(Food);

