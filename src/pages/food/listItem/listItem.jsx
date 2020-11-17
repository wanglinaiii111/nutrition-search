import React, { useEffect, useState } from 'react';
import { View } from '@tarojs/components'
import styles from './listItem.module.scss'
import { useSelector } from 'react-redux';

const ListItem = React.memo((props) => {
  const { data, clickToDetail, current } = props;
  const elementMap = useSelector(state => state.food.elementMap)
  const classList = useSelector(state => state.food.classList)
  const avatarStyle = {
    borderColor: classList[current].color,
    // backgroundPosition: classList[current].posi
  }
  const click = () => {
    clickToDetail()
  }

  return <View className={styles.container} onClick={click}>
    <View className={styles.content}>
      {/* <View className={styles.avatar} style={avatarStyle}></View> */}
      <View className={styles.name}>{data.name}
        <View className={styles.name_after} style={{ backgroundColor: classList[current].color + '1A' }}></View>
      </View>
    </View>
    <View className={styles.list}>
      {
        Object.keys(data.eles)
          .map(item => {
            return <>
              <View
                className={styles.listItem}
              >
                <View className={styles.elementName}>{
                  elementMap.map(e => {
                    if (e.code === item) {
                      return e.name
                    }
                  })
                }</View>
                <View className={styles.zhi}>
                  {data.eles[item]}
                </View>
              </View>

            </>
          })
      }
    </View>
  </View>
})

export { ListItem }
