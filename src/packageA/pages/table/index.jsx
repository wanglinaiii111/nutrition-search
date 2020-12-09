import React, { useEffect, useState } from 'react';
import { View, ScrollView } from '@tarojs/components'
import styles from './index.module.scss'
import { useSelector } from 'react-redux';
import { getFoodInfo } from '../../../utils/api'

const Table = (props) => {
  const userId = useSelector(state => state.user.userId)
  const selectedFood = useSelector(state => state.food.selectedFood)
  const selectedElement = useSelector(state => state.food.selectedElement)
  const elementMap = useSelector(state => state.food.elementMap)
  const [tableData, set_tableData] = useState([])

  const setWidth = () => {
    return Object.keys(selectedElement).length < 4 ? 100 / Object.keys(selectedElement).length + '%' : '140rpx'
  }

  useEffect(() => {
    let arr = [];
    Object.keys(selectedFood).map(key => {
      arr.push(getFoodInfo({
        code: key,
        userId: userId,
      }))
    })
    Promise.all(arr).then(res => {
      set_tableData(res)
    })
  }, [selectedFood])

  return <View className={styles.table}>
    <View className={styles.left}>
      <View className={`${styles.td} ${styles.header}`}>食材</View>
      {
        Object.keys(selectedFood).map((key, index) => {
          return <View className={`${styles.td} ${styles.header}`}>
            <View className={styles.tdText}>{selectedFood[key]['name']}</View>
          </View>
        })
      }
    </View>
    <View className={styles.right}>
      <ScrollView
        scroll-x
        style="width: 100%;white-space: nowrap;"
      >
        <View className={styles.listItem}>
          {
            Object.keys(selectedElement).map(item => {
              return <view className={`${styles.td} ${styles.header}`} style={{ width: `${setWidth()}` }}>{selectedElement[item].name}</view>
            })
          }
        </View>
        {
          tableData.map(item => {
            return <View className={styles.listItem}>
              {
                Object.keys(selectedElement).map(ele => {
                  return <view className={styles.td} style={{ width: `${setWidth()}` }}>
                    {item[ele]}
                    {
                      item[ele] && elementMap.map(e => {
                        if (e.code === ele) {
                          return e.unit
                        }
                      })
                    }
                  </view>
                })
              }
            </View>
          })
        }
      </ScrollView>
    </View>
  </View>
}

export { Table }